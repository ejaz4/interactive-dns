import { server } from "./server";
import { handleRequest } from "./middleware";
import { Statistics } from "./statistics";

export const mainIp = "192.168.0.115";
export const authority = { address: "1.1.1.1", port: 53, type: "udp" };

export const statistics = new Statistics();

setInterval(() => {
	console.log(statistics.getQueries());
}, 10000);

server.on("request", handleRequest);

server.on("listening", () =>
	console.log("server listening on", server.address()),
);
server.on("close", () => console.log("server closed", server.address()));
server.on("error", (err: any, buff: any, req: any, res: any) =>
	console.error(err.stack),
);
server.on("socketError", (err: any, socket: any) => console.error(err));

server.serve(53, mainIp);
