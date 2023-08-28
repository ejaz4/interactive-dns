"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dnsProxy = void 0;
const __1 = require("..");
const __2 = require("..");
const __3 = require("..");
const arp = require("node-arp");
const dns = require("native-node-dns");
const dnsProxy = async (question, response, cb, ip) => {
    console.log("proxying", question.name);
    console.log(question);
    const makeResponse = (mac) => {
        var request = dns.Request({
            question: question,
            server: __1.authority,
            timeout: 1000,
        });
        // when we get answers, append them to the response
        request.on("message", (err, msg) => {
            msg.answer.forEach((a) => {
                response.answer.push(a);
                console.log(response.answer);
            });
        });
        var modified = 0;
        // custom handlers here
        if (question.name == "wifi.ceccun.com") {
            modified = 1;
            response.answer.push({
                name: question.name,
                type: 1,
                class: 1,
                ttl: 1,
                address: __2.mainIp,
            });
            cb();
        }
        if (question.name.endsWith("ceccun.com") == false &&
            question.name != "cdn.jsdelivr.net") {
            // if (!fs.existsSync(`../py/devices/${mac.split(":").join("-")}`)) {
            modified = 1;
            response.answer.push({
                name: question.name,
                type: 1,
                class: 1,
                ttl: 1,
                address: __2.mainIp,
            });
            cb();
            // }
        }
        if (modified == 0) {
            request.on("end", cb);
            __3.statistics.incrementQueries();
            request.send();
        }
    };
    arp.getMAC(ip, function (err, mac) {
        if (!err) {
            makeResponse(mac);
        }
    });
};
exports.dnsProxy = dnsProxy;
