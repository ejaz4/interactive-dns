import async from "async";
import { dnsProxy } from "./proxy";

export const handleRequest = (request: any, response: any) => {
  console.log(
    "request from",
    request.address.address,
    "for",
    request.question[0].name
  );

  let f: any = []; // array of functions

  // proxy all questions
  // since proxying is asynchronous, store all callbacks
  request.question.forEach((question: any) => {
    f.push((cb: any) =>
      dnsProxy(question, response, cb, request.address.address)
    );
  });

  // do the proxying in parallel
  // when done, respond to the request by sending the response
  async.parallel(f, function () {
    response.send();
  });
};
