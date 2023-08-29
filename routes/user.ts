import { FastifyRequest } from "fastify";
import { ws } from "..";
import { prisma } from "../libs/prisma";
import arp from "@network-utils/arp-lookup";

export type DeviceGet = FastifyRequest<{
	Headers: {
		devid: string;
	};
}>;

export const userGetRoutes = () => {
	ws.get("/api/user", async (req: DeviceGet, res) => {
		try {
			const device = await prisma.device.findUnique({
				where: {
					id: req.headers.devid,
				},
				select: {
					owner: {
						select: {
							name: true,
							username: true,
						},
					},
				},
			});

			if (device) {
				res.send({
					...device.owner,
				});
			}
		} catch (e) {
			res.status(500).send({
				success: false,
				error: "deviceidentityerror",
			});
		}
	});

	ws.get("/api/device", async (req: DeviceGet, res) => {
		console.log("Device check");
		try {
			const device = await prisma.device.findUnique({
				where: {
					id: req.headers.devid,
				},
				select: {
					macAddress: true,
					approved: true,
				},
			});

			if (device) {
				res.send(device);
			}
		} catch (e) {
			res.status(500).send({
				success: false,
				error: "deviceidentityerror",
			});
		}
	});

	ws.get("/api/devices/pendingApproval", async (req: DeviceGet, res) => {
		try {
			console.log("Received");
			const thisDevice = await prisma.device.findUnique({
				where: {
					id: req.headers.devid,
				},
				select: {
					owner: {
						select: {
							devices: true,
						},
					},
				},
			});
			console.log(thisDevice);

			if (thisDevice) {
				const devices = thisDevice.owner.devices;

				const pendingApproval = devices.filter((device) => {
					return device.approved == false;
				});

				console.log(pendingApproval);

				if (pendingApproval.length > 0) {
					res.send({
						success: true,
						data: true,
					});
				} else {
					res.send({
						success: true,
						data: false,
					});
				}
			}
		} catch (e) {
			res.status(500).send({
				success: false,
				error: "deviceidentityerror",
			});
		}
	});

	ws.get("/api/device/approve", async (req: DeviceGet, res) => {
		try {
			const myOwner = await prisma.device.findUnique({
				where: {
					id: req.headers.devid,
				},
				select: {
					owner: {
						select: {
							id: true,
						},
					},
				},
			});

			const device = await prisma.device.updateMany({
				where: {
					approved: false,
					owner: {
						id: myOwner?.owner.id,
					},
				},
				data: {
					approved: true,
				},
			});

			if (device) {
				res.send({
					success: true,
				});
			} else {
				res.status(500).send({
					success: false,
					error: "notmatchingcriteria",
				});
			}
		} catch (e) {
			res.status(500).send({
				success: false,
				error: "deviceidentityerror",
			});
		}
	});

	ws.get("/api/device/cookie", async (req, res) => {
		const deviceIP = req.ip;
		const deviceMac = await arp.toMAC(deviceIP);

		console.log("New cookie request");

		if (deviceMac) {
			try {
				const device = await prisma.device.findUnique({
					where: {
						macAddress: deviceMac,
					},
					select: {
						id: true,
					},
				});

				if (device) {
					res.send({
						success: true,
						data: device.id,
					});
					console.log("New cookie request");
				} else {
					res.status(500).send({
						success: false,
						error: "deviceidentityerror",
					});
				}
			} catch (e) {
				res.status(500).send({
					success: false,
					error: "deviceidentityerror",
				});
			}
		}
	});
};
