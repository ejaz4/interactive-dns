"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequest = void 0;
const async_1 = __importDefault(require("async"));
const proxy_1 = require("./proxy");
const handleRequest = (request, response) => {
    console.log("request from", request.address.address, "for", request.question[0].name);
    let f = []; // array of functions
    // proxy all questions
    // since proxying is asynchronous, store all callbacks
    request.question.forEach((question) => {
        f.push((cb) => (0, proxy_1.dnsProxy)(question, response, cb, request.address.address));
    });
    // do the proxying in parallel
    // when done, respond to the request by sending the response
    async_1.default.parallel(f, function () {
        response.send();
    });
};
exports.handleRequest = handleRequest;
