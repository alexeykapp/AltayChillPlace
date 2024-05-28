module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static ServerError() {
        return new ApiError(500, 'Server error');
    }
    static UnauthorizedError() {
        return new ApiError(401, 'The user is not logged in')
    }
    static AccessDenied() {
        return new ApiError(403, 'Access Denied. You do not have enough permissions')
    }
    static BadRequest(message, errors = []) {
        return new ApiError(400, message)
    }
}