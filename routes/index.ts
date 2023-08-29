import { resolve } from "path";
import { ws } from "..";
import { registerRoutes } from "./register";
import { userGetRoutes } from "./user";

export const applyRoutes = () => {
	ws.register(require("@fastify/static"), {
		root: resolve(__dirname, "static"),
		wildcard: false,
	});

	registerRoutes();
	userGetRoutes();

	ws.get("/", async (req, res) => {
		res.redirect(301, "http://wifi.ceccun.com/flow/check.html");
	});

	ws.get("/*", async (req, res) => {
		res.redirect(301, "http://wifi.ceccun.com/flow/check.html");
	});
};
