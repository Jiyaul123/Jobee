const mongoose = require("mongoose");
const crypto = require("crypto");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    role: {
        type: String,
        enum: {
            values: ["User", "Employer"]
        },
        default: "User"
    },

    password: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date


}, {
    versionKey: false
})



module.exports = mongoose.model("User", userSchema)