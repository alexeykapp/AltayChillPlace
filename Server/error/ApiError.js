class ApiError extends Error {
    constructor(status, message) {
        super();
        this.message = message
        this.status = status
    }

    static badRequest(message) {
        return new ApiError(404, message || 'Bad Request')
    }
}

module.exports = new ApiError()