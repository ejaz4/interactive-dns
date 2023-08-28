"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statistics = exports.authority = exports.mainIp = void 0;
const server_1 = require("./server");
const middleware_1 = require("./middleware");
const statistics_1 = require("./statistics");
exports.mainIp = "192.168.0.110";
exports.authority = { address: "1.1.1.1", port: 53, type: "udp" };
exports.statistics = new statistics_1.Statistics();
setInterval(() => {
    console.log(exports.statistics.getQueries());
}, 10000);
server_1.server.on("request", middleware_1.handleRequest);
server_1.server.on("listening", () => console.log("server listening on", server_1.server.address()));
server_1.server.on("close", () => console.log("server closed", server_1.server.address()));
server_1.server.on("error", (err, buff, req, res) => console.error(err.stack));
server_1.server.on("socketError", (err, socket) => console.error(err));
server_1.server.serve(53, exports.mainIp);
