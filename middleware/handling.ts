import { prisma } from "../libs/prisma";
import { mainIp } from "..";

export const handler = async (question: any, mac: string, ip: string) => {
	let device;
	let found = false;
	try {
		device = await prisma.device.findUnique({
			where: {
				macAddress: mac,
			},
			select: {
				approved: true,
				owner: {
					select: {
						terminatedStatus: true,
					},
				},
			},
		});

		found = true;
	} catch (e) {}

	const notCeccun =
		question.name.endsWith("ceccun.com") == false &&
		question.name != "cdn.jsdelivr.net";

	if (!found) {
		if (notCeccun) {
			return {
				name: question.name,
				type: 1,
				class: 1,
				ttl: 1,
				address: mainIp,
			};
		}
	}

	if (device?.owner.terminatedStatus || !device?.approved) {
		if (notCeccun) {
			return {
				name: question.name,
				type: 1,
				class: 1,
				ttl: 1,
				address: mainIp,
			};
		}
	}

	return null;
};
