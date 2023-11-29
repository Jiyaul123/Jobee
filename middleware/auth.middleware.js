const jwt = require("jsonwebtoken");
const User = require("../model/user.model")



exports.authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send("Invalid Token")
        }

        const decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const user = await User.findById(decode['id']);
        if (!user) {
            return res.status(401).send("Unauthorized");
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }

}


exports.authorizedRole = (...roles) => {
    return (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                return next(`Role ${req.user.role} is not allowed to access this role.`)
            }
            next();
        } catch (error) {
            next(error)
        }
    }
}