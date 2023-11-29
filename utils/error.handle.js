function throwError(message, statusCode) {
    let newError = new Error(message || "Internal Server Error")
    newError['status'] = statusCode || 500;
    return newError;
}

module.exports = throwError
