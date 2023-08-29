import { FastifyRequest } from "fastify";
import { ws } from "..";
import { prisma } from "../libs/prisma";

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
};
