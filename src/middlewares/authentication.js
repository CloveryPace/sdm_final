const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
require('dotenv').config();

/* ================== Middleware ================== */

/**
 * Middleware: verify the identity of the user and add user_id to `req` parameter if the user is valid.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.authentication = (req, res, next) => {
    let token;

    /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: "輸入bearer空格 + jwt_token",
      required: true,
      type: "string",


    } */
    /* #swagger.responses[401] = { 
      description: "用戶未通過驗證，jwt_token或header錯誤",
      schema: "authorization fail"
      } */

    
    try {
        token = req.headers['authorization'].split(' ')[1];
    } catch (error) {
        console.error("error getting token from headers", error); 
        return res.status(401).send("invalid header"); // 現在任何header都會通過
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send("authorization fail");
        } else {
            req.user_id = decoded.userId;
            next();
        }
    });
};

exports.authorizeCreator = (req, res, next) => {
    try {
        const user_id = req.user_id;
        const activity_id = req.params.activity_id;

    } catch (error) {
    }
};