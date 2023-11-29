const User = require("../model/user.model");
const Job = require("../model/jobs.model")
const { cloudinaryUpload } = require("../utils/cloudinaryUpload");


exports.getUserData = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).send("No user found");
    }
    res.status(200).send(user)
}

exports.updateUserData = async (req, res, next) => {

    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(req.user._id, { name: name, email: email }, {
        new: true,
        runValidators: true
    });
    res.status(200).send("User updated")
}
