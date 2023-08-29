import { FastifyRequest } from "fastify";
import { ws } from "..";
import { prisma } from "../libs/prisma";
import { DeviceGet } from "./user";
import arp from "@network-utils/arp-lookup";

type NewUserRequest = FastifyRequest<{
	Body: {
		name: string;
		username: string;
	};
}>;

export const registerRoutes = () => {
	ws.post("/api/devices/renew", async (req: DeviceGet, res) => {
		const deviceIP = req.ip;
		const deviceMac = await arp.toMAC(deviceIP);

		if (!deviceMac) {
			return res.status(500).send({
				success: false,
				error: "deviceidentityerror",
			});
		}

		try {
			const device = await prisma.device.update({
				where: {
					id: req.headers.devid,
				},
				data: {
					macAddress: deviceMac,
				},
			});

			if (device) {
				res.send({
					success: true,
					action: "devicerenewed",
				});
			} else {
				res.status(500).send({
					success: false,
					error: "deviceidentityerror",
				});
			}
		} catch (e) {
			console.log(e);
			res.status(500).send({
				success: false,
				error: "deviceidentityerror",
			});
		}
	});

	ws.post("/api/users/new", async (req: NewUserRequest, res) => {
		const arp = require("node-arp");
		const deviceIP = req.ip;
		let deviceMac = "00:00:00:00:00:00";

		const afterMac = async () => {
			if (deviceMac === "00:00:00:00:00:00") {
				res.status(500).send({
					success: false,
					error: "deviceidentityerror",
				});
			}

			try {
				const user = await prisma.account.create({
					data: {
						name: req.body.name,
						username: req.body.username,
					},
				});

				try {
					const device = await prisma.device.create({
						data: {
							macAddress: deviceMac,
							approved: true,
							owner: {
								connect: {
									id: user.id,
								},
							},
						},
					});

					res.send({
						success: true,
						action: "usercreated",
						data: {
							id: device.id,
						},
					});
				} catch (error: any) {}
			} catch (error: any) {
				if (error.code === "P2002") {
					const user = await prisma.account.findUnique({
						where: {
							username: req.body.username,
						},
					});

					if (user) {
						const device = await prisma.device.create({
							data: {
								macAddress: deviceMac,
								approved: false,
								owner: {
									connect: {
										id: user.id,
									},
								},
							},
						});
						res.send({
							success: true,
							action: "approvalrequired",
							data: {
								id: device.id,
							},
						});
					}
				}
			}
		};

		await arp.getMAC(deviceIP, async (err: any, mac: string) => {
			if (!err) {
				console.log(res.sent);
				deviceMac = mac;
				await afterMac();
			} else {
				res.status(500).send({
					success: false,
					error: "deviceidentityerror",
				});
			}
		});
	});
};
