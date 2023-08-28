export class Statistics {
	queries: number;

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
