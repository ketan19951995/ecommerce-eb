console.log("insde controler");
const User = require('../models/user');
const helper = require('../common/helper')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    let { name, email, password } = req.body;
    if (!email || !password) {
        res.send(helper.respondWithResult(422, { message: "Missing email or password", result }));
    }
    let hashedPassword = await helper.hashPassword(password);
    try {
        let newUser = {
            name,
            email,
            password: hashedPassword
        }
        let userRecord = new User(newUser);
        // Check if the email is in use
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            res.send(helper.respondWithResult(409, { message: "Email is already in use.", existingUser }));
        }
        let result = await userRecord.save();
        const verificationToken = await helper.generateVerificationToken(result._id);
        await helper.sendEmailWithVerificationLink(verificationToken, result.email);
        res.send(helper.respondWithResult(200, { message: "user registered successfully , please check your email", "result": verificationToken }));
    } catch (err) {
        res.send(helper.handleError(err));
    }
}

exports.login = async (req, res) => {
    let { email, password } = req.body;
    try {
        let result = await User.findOne({ "email": email });
        if (!result) {
            res.send(helper.respondWithResult(404, { message: "No email exists", result }));
        }
        let { password: hashedPassword } = result
        let result1 = await helper.comparePassword(password, hashedPassword);
        const verificationToken = await helper.generateVerificationToken(result._id);
        if (result1) {
            res.send(helper.respondWithResult(200, { message: "Login Successfull", "result" : verificationToken }));
        } else {
            res.send(helper.respondWithResult(200, { message: "Password is wrong", result: "" }));
        }
    } catch (err) {
        res.send(helper.handleError(err));
    }
};

exports.verifyToken = async (req, res) => {
    let { token } = req.params;
    try {
        let decoded = jwt.verify(token, process.env.SECRETKEY);
        let { ID } = decoded;
        let result = await User.findByIdAndUpdate({ "_id": mongoose.Types.ObjectId(ID) }, { "isUsed": true });
        if (result) {
            res.send(helper.respondWithResult(200, { message: "user verified successfully", result }));
        } else {
            res.send(helper.respondWithResult(404, { message: "Id not found", result }));
        }

    } catch (err) {
        res.send(helper.handleError(err));
    }
};
