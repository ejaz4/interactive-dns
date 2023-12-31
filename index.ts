import { server } from "./server";
import { handleRequest } from "./middleware";
import { Statistics } from "./statistics";
import fastify from "fastify";
import { applyRoutes } from "./routes";

export const mainIp = "192.168.0.109";
export const authority = { address: "8.8.8.8", port: 53, type: "udp" };

export const statistics = new Statistics();

export const ws = fastify({
	forceCloseConnections: false,
});

applyRoutes();

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
ws.listen({ host: mainIp, port: 80 });
