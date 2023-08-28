"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statistics = void 0;
class Statistics {
    queries;
    constructor() {
        this.queries = 0;
    }
    incrementQueries() {
        this.queries++;
    }
    getQueries() {
        return this.queries;
    }
}
exports.Statistics = Statistics;
