import { FastifyRequest } from "fastify";
import { ws } from "..";
import { prisma } from "../libs/prisma";

type NewUserRequest = FastifyRequest<{
	Body: {
		name: string;
		username: string;
	};
}>;

export const registerRoutes = () => {
	ws.post("/api/users/new", async (req: NewUserRequest, res) => {
		const arp = require("node-arp");
		const deviceIP = req.ip;
		let deviceMac = "00:00:00:00:00:00";
		console.log(deviceIP);

		const afterMac = async () => {
			if (deviceMac === "00:00:00:00:00:00") {
				res.status(500).send({
					success: false,
					error: "deviceidentityerror",
				});
			}

			console.log(deviceMac);
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

		await arp.getMAC(deviceIP, (err: any, mac: string) => {
			if (!err) {
				console.log(mac);
				deviceMac = mac;
				afterMac();
			} else {
				res.status(500).send({
					success: false,
					error: "deviceidentityerror",
				});
			}
		});
	});
};
