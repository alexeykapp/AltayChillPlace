const ApiError = require("../error/api-error");

module.exports = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return next(ApiError.AccessDenied());
    }
}