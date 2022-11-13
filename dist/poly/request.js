"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const https = require("https");
// Generic polyfill for "request" npm package, wrapper for https
const nodeReq = ({ method, url, headers, qs, timeout, body }) => new Promise((resolve) => {
    let req;
    try {
        req = https.request(url + (qs != null ? `?${new URLSearchParams(qs).toString()}` : ""), { method, headers, timeout }, (res) => __awaiter(void 0, void 0, void 0, function* () {
            const loc = res.headers.location;
            if (loc)
                return resolve(yield nodeReq({ url: loc, method, headers, timeout, body }));
            resolve(res);
        }));
    }
    catch (e) {
        return resolve(e);
    }
    req.on("error", resolve);
    if (body)
        req.write(body); // Write POST body if included
    req.end();
});
const request = (...args) => {
    let options, callback;
    switch (args.length) {
        case 3: // request(url, options, callback)
            options = Object.assign({ url: args[0] }, args[1]);
            callback = args[2];
            break;
        default: // request(url, callback) / request(options, callback)
            options = args[0];
            callback = args[1];
    }
    if (typeof options === "string") {
        options = {
            url: options
        };
    }
    const listeners = {};
    nodeReq(options).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (!res.statusCode) {
            (_a = listeners["error"]) === null || _a === void 0 ? void 0 : _a.call(listeners, res);
            return callback === null || callback === void 0 ? void 0 : callback(res, null, null);
        }
        (_b = listeners["response"]) === null || _b === void 0 ? void 0 : _b.call(listeners, res);
        let data = [];
        res.on("data", (chunk) => {
            var _a;
            data.push(chunk);
            (_a = listeners["data"]) === null || _a === void 0 ? void 0 : _a.call(listeners, chunk);
        });
        yield new Promise((resolve) => res.on("end", resolve)); // Wait to read full body
        const buf = Buffer.concat(data);
        callback === null || callback === void 0 ? void 0 : callback(undefined, res, options.encoding !== null ? buf.toString() : buf);
    }));
    const ret = {
        on: (type, handler) => {
            listeners[type] = handler;
            return ret; // Return self
        }
    };
    return ret;
};
for (const m of ["get", "post", "put", "patch", "delete", "head", "options"]) {
    request[m] = (url, callback) => request({ url, method: m }, callback);
}
request.del = request.delete; // Special case
module.exports = request;
