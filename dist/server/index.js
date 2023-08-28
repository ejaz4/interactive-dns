"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const dns = require("native-node-dns");
const arp = require("node-arp");
exports.server = dns.createServer();
