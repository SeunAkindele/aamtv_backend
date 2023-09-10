
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    lazyLoader() {
        const skip = parseInt(this.queryString.skip);
        // skip & limit for lazy loader
        this.query = this.query.skip(skip).limit(7);
        
        return this;
    }

    limit() {
        // limit query rows
        this.query = this.query.limit(20);

        return this;
    }

    sortByTime() {
        // sort by time in descending order
        this.query = this.query.sort({createdAt: -1});

        return this;
    }

    // sort by appearance in descending order
    sortByAppearance() {
        
    }
}

module.exports = APIFeatures;