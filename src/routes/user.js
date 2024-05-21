const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const jwt = require('jsonwebtoken');
require('dotenv').config();

var router = express.Router();
router.use(bodyParser.json());

const User = require('../model/userModel');
const { userFollow } = require("../model/userModel");
const userController = require('../controllers/user_controller');
// User.sync();
userFollow.sync()
const authMiddleware = require('../middlewares/authentication');



// GET routes
router.get(
  "/", authMiddleware.authentication, 
  // #swagger.description = "取得特定會員資料"
  // #swagger.summary = "取得單一會員資料"
  // #swagger.tags = ['User']
  /* 
  
  /* #swagger.responses[200] = { 
      description: '用戶詳細資料',
      schema: 
      [{
        "members": "{ ... }"
      }]
    } */ 
  /* #swagger.responses[404] = { 
      description: "用戶不存在",
      schema: {
            "error": "User not found.",
          }
      } */
  /* #swagger.responses[500] = { 
      description: "網路或其他不明原因錯誤"
      } */

  userController.getMember);

router.get(
  "/allMembers", authMiddleware.authentication, 
  // #swagger.description = "取得所有會員資料"
  // #swagger.summary = "取得所有會員資料"
  // #swagger.tags = ['User']
  /* 
  
  /* #swagger.responses[200] = { 
      description: '用戶詳細資料',
      schema: 
      [{
        "members": "{ ... }"
      }]
    } */ 
  /* #swagger.responses[404] = { 
      description: "用戶不存在",
      schema: {
            "error": "User not found.",
          }
      } */
  /* #swagger.responses[500] = { 
      description: "網路或其他不明原因錯誤"
      } */

  userController.getAllMembers);

router.get(
  "/forgetPassword", 
  // #swagger.tags = ['User']
  // #swagger.description = '忘記密碼，輸入信箱後發送驗證碼'
  /* 
  
  /* #swagger.responses[200] = { 
      description: "忘記密碼驗證信發送成功",
      schema: {
            "message": "You have requested to reset your password. Please verify within 10 minute."
          }
      } */
  /* #swagger.responses[404] = { 
      description: "用戶不存在",
      schema: {
            "error": "User not found.",
          }
      } */
  /* #swagger.responses[500] = { 
      description: "網路或其他不明原因錯誤"
      } */
  
  userController.forgetPassword);

router.get(
  "/emailSend", 
  // #swagger.description = "信箱註冊驗證碼發送"
  // #swagger.summary = "發送註冊信"
  // #swagger.tags = ['User']
  /* 
  
  /* #swagger.responses[200] = { 
      description: "註冊驗證信發送成功",
      schema: {
            "message": "You have requested to reset your password. Please verify within 10 minute."
          }
      } */
  /* #swagger.responses[409] = { 
      description: "用戶已存在，請使用其他信箱",
      schema: {
            "error": "User already exists.",
          }
      } */
  /* #swagger.responses[500] = { 
      description: "網路或其他不明原因錯誤"
      } */
  
  userController.emailSend)

// POST routes
router.post(
  "/signup",
  // #swagger.description = "註冊，請先至/user/emailSend取得驗證碼"
  // #swagger.summary = "會員註冊"
  // #swagger.tags = ['User']
  /* 
  #swagger.parameters['body'] = {
      in: 'body',
      description: 'Sign up 內容',
      required: true,
      schema: 
      {
        "name": "用戶名稱",
        "email": "用戶信箱",
        "birthday": "2000-01-01",
        "gender": "male",
        "password": "any",
        "code": "驗證碼"
      }
    } */
  /* #swagger.responses[201] = { 
      description: "建立成功",
      schema: {
            "message": "Member created successfully.",
            "token": "JWT_token"
          }
      } */
  /* #swagger.responses[401] = { 
      description: "Invalid or expired verification code."
      } */
  /* #swagger.responses[409] = {
      description: "Email Conflict",
      schema: {
            "error": "Email already exists"
        }
      } */
  /* #swagger.responses[500] = { 
      description: "網路或其他不明原因錯誤"
      } */

userController.signUp);

router.post(
  "/oauthSignup",
  // #swagger.description = "Oauth註冊，會回傳jwt token" 
  // #swagger.summary = "Oauth會員註冊"
  // #swagger.tags = ['User']
  /* 
  #swagger.parameters['body'] = {
      in: 'body',
      description: 'Oauth Sign up 內容',
      required: true,
      schema: 
      {
        "name": "用戶姓名",
        "email": "r12725066@ntu.edu.tw",
        "oauthProvider": "Google"
      }
  } */
  /* #swagger.responses[201] = { 
      description: "登入成功",
      schema: {
            "message": "Sign in successfully.",
            "token": "JWT_token"
          }
      } */
  
  /* #swagger.responses[409] = {
      description: "Email Conflict",
      schema: {
            "error": "Email already exists"
        }
  } */

  /* #swagger.responses[500] = { 
      description: "網路或其他不明原因錯誤"
  } */

  userController.oauthSingup);

router.post(
  "/signin",
  // #swagger.description = "登入，請先確定已註冊成功" 
  // #swagger.summary = "會員登入"
  // #swagger.tags = ['User']
  /* 
  #swagger.parameters['body'] = {
      in: 'body',
      description: 'Sign in 內容',
      required: true,
      schema: 
      {
        "email": "r12725066@ntu.edu.tw",
        "password": "a"
      }
  } */
  /* #swagger.responses[201] = { 
      description: "登入成功",
      schema: {
            "message": "Sign in successfully.",
            "token": "JWT_token"
          }
      } */
  /* #swagger.responses[401] = { 
      description: "密碼錯誤",
      schema: {
            "error": "Invalid credentials",
          }
      } */
  /* #swagger.responses[404] = { 
      description: "用戶不存在",
      schema: {
            "error": "User not found.",
          }
      } */
  /* #swagger.responses[500] = { 
      description: "網路或其他不明原因錯誤"
      } */

userController.signIn);

router.post(
  "/resetPassword",
  // #swagger.description = "重設密碼，請確定已從/user/forgetPassword取得驗證碼"
  // #swagger.summary = "重設密碼"
  // #swagger.tags = ['User']
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: '收到驗證信後，重設密碼',
    required: true,
    schema: 
    {
      "email": "用戶信箱",
      "code": "驗證碼",
      "newPassword": "用戶新密碼"
    }
} */
/* #swagger.responses[200] = { 
    description: "密碼更改成功",
    schema: {
          "message": "Password reset successfully"
        }
    } */
/* #swagger.responses[401] = { 
    description: "驗證碼錯誤",
    schema: {
          "error": "Invalid or expired verification code",
        }
    } */
/* #swagger.responses[404] = { 
    description: "用戶不存在",
    schema: {
          "error": "User not found.",
        }
    } */
/* #swagger.responses[500] = { 
    description: "網路或其他不明原因錯誤"
    } */
  

  userController.resetPassword);

// PUT routes
router.put(
  "/", authMiddleware.authentication, 
  // #swagger.description = "修改會員資料，請確定Authorization格式正確 'bearer '+ JWT token "
  // #swagger.summary = "更新會員資料"
  // #swagger.tags = ['User']
  /* #swagger.security = [{
            "bearerAuth": [
              {
                type: 'http',
                scheme: 'bearer'
              }
            ]
    }] */
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: '更新會員資料',
      required: true,
      schema: 
      {
        "name": "用戶名稱",
        "phoneNum": "電話號碼",
        "gender": "性別",
        "aboutMe": "個人簡介"
      }
  } */
  /* #swagger.responses[200] = { 
      description: "會員資料更新成功",
      schema: {
            "message": "Member updated successfully",
          }
      } */
  /* #swagger.responses[401] = { 
      description: "使用者身分驗證錯誤",
      schema: {
            "message": "authorization fail"
          }
      } */
  /* #swagger.responses[404] = { 
      description: "請至少更新一行",
      schema: {
            "message": "Please update at least one row.",
          }
      } */
  /* #swagger.responses[500] = { 
      description: "網路或其他不明原因錯誤"
      } */

userController.updateMember);

router.post(
  "/:user_id/follow", 
  // #swagger.summary = "追蹤會員"
  // #swagger.description = "追蹤其他會員"
  // #swagger.tags = ['User']
  /* #swagger.parameters['user_id'] = {
      in: 'path',
      description: '追蹤會員id',
      required: true
  } */

  /* #swagger.responses[201] = { 
      description: "會員追蹤成功",
      schema: {
            "message": "Member followed successfully",
            "follow": "追蹤資料"
          }
      } */

   /* #swagger.responses[402] = { 
      description: "已追蹤該會員",
      schema: {
             "message": "Already follow this user.",
          }
      } */


  /* #swagger.responses[404] = { 
      description: "要追蹤的會員不存在",
      schema: {
             "message": "Following User not found.",
          }
      } */

  /* #swagger.responses[500] = { 
      description: "網路或其他不明原因錯誤"
      } */
  
  
  authMiddleware.authentication, userController.followMember)

router.post(
  "/:user_id/unfollow", 
  // #swagger.summary = "取消追蹤會員"
  // #swagger.description = "取消追蹤其他會員"
  // #swagger.tags = ['User']
  /* #swagger.parameters['user_id'] = {
      in: 'path',
      description: '取消追蹤會員id',
      required: true
  } */

  /* #swagger.responses[201] = { 
      description: "會員取消追蹤成功",
      schema: {
            "message": "Unfollowed successfully",
          }
      } */

    /* #swagger.responses[400] = { 
      description: "未追蹤該會員",
      schema: {
              "message": "You are not following this user.",
          }
      } */


  /* #swagger.responses[404] = { 
      description: "要取消追蹤的會員不存在",
      schema: {
              "message": "Following User not found.",
          }
      } */

  /* #swagger.responses[500] = { 
      description: "網路或其他不明原因錯誤"
      } */
  
    
   authMiddleware.authentication, userController.unfollowMember)

router.get(
  "/:user_id/following", 
  // #swagger.summary = "取得會員追蹤中列表"
  // #swagger.description = "取得一位會員追蹤中的所有會員列表"
  // #swagger.tags = ['User']
  

  /* #swagger.responses[200] = { 
      description: "會員追蹤中列表",
      schema: {
          "follow_id": "追蹤id",
          "followerId": "追蹤者id",
          "followingId": "被追蹤者id",
          "Following": {
            "name": "用戶名稱",
            "self_introduction": "簡介"
          }
      },
    } */

  /* #swagger.responses[404] = { 
      description: "會員不存在",
      schema: {
             "message": "User not found.",
          }
      } */

  /* #swagger.responses[500] = { 
      description: "網路或其他不明原因錯誤"
      } */
  
  
  authMiddleware.authentication, userController.getFollowing)

router.get(
  "/:user_id/follower", 
  // #swagger.summary = "取得會員追蹤者"
  // #swagger.description = "取得一位會員的追蹤者列表"
  // #swagger.tags = ['User']
  

  /* #swagger.responses[200] = { 
      description: "會員追蹤者列表",
      schema: {
          "follow_id": "追蹤id",
          "followerId": "追蹤者id",
          "followingId": "被追蹤者id",
          "Follower": {
            "name": "用戶名稱",
            "self_introduction": "簡介"
          }
      },
    } */

  /* #swagger.responses[404] = { 
      description: "會員不存在",
      schema: {
             "message": "User not found.",
          }
      } */

  /* #swagger.responses[500] = { 
      description: "網路或其他不明原因錯誤"
      } */
  

  
  
  
  authMiddleware.authentication, userController.getFollower)

// DELETE routes
router.delete(
  "/", authMiddleware.authentication, 
  // #swagger.description = "刪除會員，請確定Authorization格式正確 'bearer '+ JWT token "
  // #swagger.summary = "刪除會員"
  // #swagger.tags = ['User']
  /* #swagger.security = [{
            "bearerAuth": [
              {
                type: 'http',
                scheme: 'bearer'
              }
            ]
    }] */

  /* #swagger.responses[204] = { 
      description: "會員刪除成功",
      schema: {
            "message": "Member deleted successfully",
          }
      } */
  /* #swagger.responses[401] = { 
      description: "使用者身分驗證錯誤",
      schema: {
            "message": "authorization fail",
          }
      } */
  /* #swagger.responses[404] = { 
      description: "會員不存在",
      schema: {
             "message": "Member not found.",
          }
      } */
  /* #swagger.responses[500] = { 
      description: "網路或其他不明原因錯誤"
      } */
  
  userController.deleteMember);


// Configure the Google strategy for use 
passport.use('signup-google', new GoogleStrategy({
  clientID: process.env.googleClientID,
  clientSecret: process.env.googleClientSecret,
  callbackURL: "/user/oauth2callback/signup"
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ where: { oauthId: profile.id } });
      if (user) {
        return done(null, user);
      } else {
        const existingEmailUser = await User.findOne({ where: { email: profile.emails[0].value } });
        if (existingEmailUser) {
          // Email already exists in the database, send a custom error message
          return done(null, false, { message: 'Email already registered' });
        }
        const newUser = await User.create({
          oauthId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          oauthProvider: 'google'
        });
        return done(null, newUser);
      }

    } catch (error) {
      return done(error);

    }
  }
));

passport.use('login-google', new GoogleStrategy({
  clientID: process.env.googleClientID,
  clientSecret: process.env.googleClientSecret,
  callbackURL: "/user/oauth2callback/login"
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ where: { oauthId: profile.id } });
      if (!user) {
        return done(new Error('User not found.'));
      }
      return done(null, user); //'登入成功'
    } catch (error) {
      return done(error);
    }
  }
));


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.use(session({
  secret: 'sdm_is_so_fun',
  resave: false,
  saveUninitialized: true
}));

router.use(passport.initialize());
router.use(passport.session());

// Signup route
// router.get('/auth/google/signup',
//   // #swagger.description = 'Oauth註冊API，請注意不要跟/user/signup之信箱相同'
//   // #swagger.tags = ['User']
//   passport.authenticate('signup-google', { scope: ['profile', 'email'] })
// );

// router.get(
//   '/oauth2callback/signup',
//   // #swagger.description = 'OAuth callback for signup. Redirects to home page on success.'
//   // #swagger.tags = ['User']
  
//   passport.authenticate('signup-google', { session: false, failureRedirect: '/auth/failure' }),
//   (req, res) => {
//     const user = req.user;
//     console.log(user.user_id);
//     const token = jwt.sign(
//       { userId: user.user_id }, 
//       process.env.JWT_SECRET, 
//       { expiresIn: process.env.JWT_EXPIRES_IN } 
//     );

//     // res.status(200).json ({
//     //   status: 'success',
//     //   message: 'User authenticated successfully',
//     //   token
//     // })
//     console.log(token);
//     res.cookie('token', token, { httpOnly: false, secure: false, domain: '.zapto.org'  });
//     res.redirect('http://ntugether.zapto.org:3000');
//   }
// );

// // Login route
// router.get('/auth/google/login',
//   // #swagger.description = 'Oauth登入API'
//   // #swagger.tags = ['User']
//   passport.authenticate('login-google', { scope: ['profile', 'email'] })
// );

// router.get(
//   '/oauth2callback/login',
//   // #swagger.description = 'OAuth callback for login. Redirects to home page on success.'
//   // #swagger.tags = ['User']
//   /* #swagger.responses[200] = { 
//       description: "Google Oauth登入成功",
//       schema: {
//             "status": "success",
//             "message": "User authenticated successfully",
//             "token": "jwt_token"
//           }
//       } */
//   passport.authenticate('login-google', { failureRedirect: '/auth/failure' }),
//   (req, res) => {
//     const user = req.user;
//     console.log(user.user_id);
//     const token = jwt.sign(
//       { userId: user.user_id }, 
//       process.env.JWT_SECRET, 
//       { expiresIn: process.env.JWT_EXPIRES_IN } 
//     );
//     // res.status(200).json ({
//     //   status: 'success',
//     //   message: 'User authenticated successfully',
//     //   token
//     // })
//     console.log(token);
//     res.cookie('token', token, { httpOnly: false, secure: false, domain: '.zapto.org' });
//     res.redirect('http://ntugether.zapto.org:3000');
//   }
// );



// router.get('/auth/failure', (req, res) => {
//   // #swagger.description = 'Oauth驗證失敗API'
//   // #swagger.tags = ['User']
//   return res.send('Failed to authenticate.');
// });

module.exports = router;
