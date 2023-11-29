const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const nodemailer = require("nodemailer")

exports.createPasswordHash = (password) => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt)
}


exports.comparePassword = (hashPassword, plainPassword) => {
    console.log({ hashPassword, plainPassword })
    return bcrypt.compareSync(plainPassword, hashPassword)
}

exports.generateJwtToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })
}

exports.generateResetPasswordToken = () => {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    return { resetPasswordToken, resetToken };
}

exports.sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        }
    });

    const message = {
        from: `${process.env.SMTP_FROM_NAME}<${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.text
    }

    await transporter.sendMail(message)
}