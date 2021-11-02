const UserModel = require('./../../models/users');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');


// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, './public');
//     },
//     filename: (req, file, callback) => {
//         callback(null, file.fieldname);
//     }
// });

class Users {
    static validateUserData(userObj, res) {
        let invalidParams = [];
        let isValid = true;
        if (!userObj.name || userObj.name === undefined || userObj.name === '') {
            isValid = false;
            invalidParams.push('name');
        }
        if (!userObj.email || userObj.email === undefined || userObj.email === '') {
            isValid = false;
            invalidParams.push('email');
        }
        if (!userObj.password || userObj.password === undefined || userObj.password === '') {
            isValid = false;
            invalidParams.push('password');
        }
        if (!userObj.profilePicture || userObj.profilePicture === undefined || userObj.profilePicture === '') {
            isValid = false;
            invalidParams.push('profilePicture');
        }
        if (!isValid) {
            res.status(400).send({
                message: `Missing required parameter(s) ${invalidParams.join(', ')}.`
            });
        }
    }

    static async createUser(req, res) {
        const userData = req.body;
        Users.validateUserData(userData, res);

        const emailExist = await UserModel.findOne({
            email: userData.email
        });
        if (emailExist) {
            res.status(400).send({
                message: 'Email already exists.'
            });
        }
        const user = await new UserModel(userData);
        try {
            user.save();
        } catch (error) {
            res.status(400).send({
                message: 'Something went wrong while creating user.'
            });
        }
        // upload image to server in public dir
        // let upload = multer({
        //     storage: storage,
        // }).single('profilePicture');

        // upload(req, res, function (err) {
        //     console.log('err', err);
        // });
        await Users.sendMail(user.email);
        res.send({
            name: user.name
        });
    }

    static async loginUser(req, res) {
        const {
            email,
            password
        } = req.body;
        if (!email) {
            res.status(400).send({
                message: 'Missing required parameter(s) email.'
            });
        }
        if (!password) {
            res.status(400).send({
                message: 'Missing required parameter(s) password.'
            });
        }
        const user = await UserModel.findOne({
            email,
            password
        }, {
            password: 0
        }).lean();
        if (!user) {
            res.status(401).send({
                message: 'Invalid Credentials.'
            });
        } else {
            const token = jwt.sign({
                _id: user._id
            }, process.env.TOKEN_SECRET);
            res.header("auth-token", token).status(201).send({
                name: user.name,
                token
            });
        }
    }

    static async sendMail(userEmail) {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        await transporter.sendMail({
            from: 'testuser@gmail.com', // sender address
            to: userEmail, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<div><label> Welcome to tip manager system.</label></div>", // html body
        });
        return userEmail;
    }
}

module.exports = Users;