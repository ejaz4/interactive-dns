import { authority } from "..";
import { mainIp } from "..";
import { handler } from "./handling";
import { statistics } from "..";

const arp = require("node-arp");
const dns = require("native-node-dns");

export const dnsProxy = async (
	question: any,
	response: any,
	cb: any,
	ip: string,
) => {
	console.log("proxying", question.name);
	console.log(question);

	const makeResponse = async (mac: string) => {
		var request = dns.Request({
			question: question, // forwarding the question
			server: authority, // this is the DNS server we are asking
			timeout: 1000,
		});
		// when we get answers, append them to the response
		request.on("message", (err: any, msg: any) => {
			msg.answer.forEach((a: any) => {
				response.answer.push(a);
				console.log(response.answer);
			});
		});

		var modified = 0;
		// custom handlers here
		// if (question.name == "wifi.ceccun.com") {
		// 	modified = 1;
		// 	response.answer.push({
		// 		name: question.name,
		// 		type: 1,
		// 		class: 1,
		// 		ttl: 1,
		// 		address: mainIp,
		// 	});
		// 	cb();
		// }

		// if (
		// 	question.name.endsWith("ceccun.com") == false &&
		// 	question.name != "cdn.jsdelivr.net"
		// ) {
		// 	// if (!fs.existsSync(`../py/devices/${mac.split(":").join("-")}`)) {
		// 	modified = 1;
		// 	response.answer.push({
		// 		name: question.name,
		// 		type: 1,
		// 		class: 1,
		// 		ttl: 1,
		// 		address: mainIp,
		// 	});
		// 	cb();
		// 	// }
		// }

		const handlerResponse = await handler(question, mac, ip);

		if (handlerResponse != null) {
			modified = 1;
			response.answer.push(handlerResponse);
			cb();
		}

		if (modified == 0) {
			request.on("end", cb);
			statistics.incrementQueries();
			try {
				request.send();
			} catch (e) {
				console.error("This error is being investigated.");
			}
		}
	};

	arp.getMAC(ip, function (err: any, mac: string) {
		if (!err) {
			makeResponse(mac);
		}
	});
};
