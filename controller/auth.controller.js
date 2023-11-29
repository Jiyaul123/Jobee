const User = require("../model/user.model");
const crypto = require("crypto")
const { createPasswordHash, comparePassword, generateJwtToken, generateResetPasswordToken, sendEmail } = require("../utils/password.handle");



exports.createUser = async (req, res, next) => {
    try {
        const { name, email, role } = req.body;
        const password = req.body.password;

        const hashPassword = createPasswordHash(password);

        const user = await User.create({ name, email, password: hashPassword, role });
        if (!user) {
            res.status(404).send("Unable to create user")
        }
        res.status(200).send("User created")

    } catch (error) {
        next(error)
    }
}


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).send("Incorrect Email.");
        }

        if (comparePassword(user?.password, password)) {
            const token = generateJwtToken(user._id);
            const option = {
                expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true
            };
            res.status(200).cookie('token', token, option).send({ token });
        } else {
            return res.status(401).send("Incorrect Password.");
        }
    } catch (error) {
        next(error);
    }
};


exports.forgotPassword = async (req, res, next) => {
    try {

        const email = req.body.email;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).send("No user found with this email");
        }

        const { resetPasswordToken, resetToken } = generateResetPasswordToken();

        user.resetPasswordToken = resetPasswordToken;
        //Set expiry time 30 mins
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

        await user.save({ validateBeforeSave: false });


        const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
        const message = `Your password reset link is as follow:\n\n${resetUrl}\n\n If you have not request this, then please ignore that.`

        await sendEmail({
            email: user.email,
            subject: 'Password Reset Email',
            text: message
        });
        res.status(200).send(`Email sent successfully to: ${user.email}`)

    } catch (error) {
        next(error)
    }
}


exports.resetPassword = async (req, res, next) => {
    try {
        const token = req.params.token;
        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })

        if (!user) {
            res.status(404).send("Password reset token is Invalid")
        }

        const hashPassword = createPasswordHash(req.body.password);
        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).send("Password Updated")


    } catch (error) {
        next(error)
    }
}