const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
require('dotenv').config()


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

function respondWithResult(statusCode, data) {
    const status = statusCode || 200;
    return {
        message: data.message,
        error: false,
        statusCode: status,
        data: data.result
    };
}

function handleError(error) {
    const status = error.status || 500;
    return {
        error,
        message: error.message,
        statusCode: status,

    };
}

function generateVerificationToken(userId) {
    let token = jwt.sign({ ID: userId }, process.env.SECRETKEY, { expiresIn: "7d" });
    return token;
}

function sendEmailWithVerificationLink(verificationToken, email) {
    const url = `http://localhost:3000/user/verify/${verificationToken}`
    transporter.sendMail({
        to: email,
        subject: 'Verify Account',
        html: `Click <a href = '${url}'>here</a> to confirm your email.`
    })
}


async function hashPassword(plainPassword) {
    const password = plainPassword
    const saltRounds = 10;
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })

    return hashedPassword
}
async function comparePassword(plainPassword, hashpassword) {
    let result  = await bcrypt.compare(plainPassword, hashpassword);
    return result;
};

module.exports = {
    respondWithResult,
    handleError,
    generateVerificationToken,
    sendEmailWithVerificationLink,
    hashPassword,
    comparePassword
};