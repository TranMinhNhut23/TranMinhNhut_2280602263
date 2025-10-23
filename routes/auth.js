var express = require('express');
var router = express.Router();
let users = require('../schemas/users');
let roles = require('../schemas/roles');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken')
let { Response } = require('../utils/responseHandler')
let { Authentication, Authorization } = require('../utils/authHandler')
let { validatorRegister, validatorChangpassword, validatorForgotPassword, validatedResult } = require('../utils/validator')
let { sendMail } = require('../utils/sendMailHandler');
let { uploadAFileWithField } = require('../utils/uploadHandler');

router.post('/register', validatorRegister, validatedResult, async function (req, res, next) {
  let role = await roles.findOne({ name: "USER" });
  role = role._id;
  let newUser = new users({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: role
  })
  await newUser.save();
  Response(res, 200, true, "dang ki thanh cong");
});
router.post('/login', async function (req, res, next) {
  try {
    let username = req.body.username;
    let password = req.body.password;

    let user = await users.findOne({
      username: username,
      isDeleted: false
    });

    if (!user) {
      return Response(res, 404, false, "User not found");
    }

    let result = bcrypt.compareSync(password, user.password);
    if (result) {
      let token = jwt.sign({
        _id: user._id,
        exp: Date.now() + 60 * 60 * 1000
      }, "NNPTUD");

      res.cookie("token", "Bearer " + token, {
        httpOnly: true,
        maxAge: 60 * 1000 * 60 * 24 * 7
      });

      // Update login count
      user.loginCount += 1;
      await user.save();

      Response(res, 200, true, token);
    } else {
      Response(res, 403, false, "Incorrect password");
    }
  } catch (error) {
    Response(res, 500, false, error.message);
  }
});
router.post("/logout", function (req, res, next) {
  try {
    res.cookie("token", "");
    Response(res, 200, true, "logout thanh cong");
  } catch (error) {
    Response(res, 404, false, "token sai");
  }
})
router.get('/me', Authentication, Authorization("ADMIN", "MOD", "USER"), async function (req, res, next) {
  let user = await users.findById(req.userId).select(
    "username email fullname avatarURL"
  ).populate({
    path: 'role',
    select: 'name'
  });
  Response(res, 200, true, user)
})
router.post('/changepassword', Authentication, validatorChangpassword, validatedResult, async function (req, res, next) {
  let user = await users.findById(req.userId);
  if (bcrypt.compareSync(req.body.oldpassword, user.password)) {
    user.password = req.body.newpassword;
    await user.save();
    Response(res, 200, true, "doi password thanh cong");
  } else {
    Response(res, 400, false, "oldpassword khong dung");
  }

})
router.post('/forgotpassword', validatorForgotPassword, async function (req, res, next) {
  let user = await users.find({
    email: req.body.email
  })
  if (user.length > 0) {
    user = user[0];
    user.forgotPasswordToken = GenerateRandomString(64);
    user.forgotPasswordTokenExp = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    let URL = "http://localhost:3000/auth/resetpassword/" + user.forgotPasswordToken;
    await sendMail(user.email, URL)
    Response(res, 200, true, URL);
  } else {
    Response(res, 404, false, "email khogn ton tai");
  }
})
router.post('/resetpassword/:token', async function (req, res, next) {
  let user = await users.find({
    forgotPasswordToken: req.params.token
  })
  if (user.length > 0) {
    user = user[0];
    if (user.forgotPasswordTokenExp < Date.now()) {
      user.forgotPasswordToken = "";
      user.forgotPasswordTokenExp = 0;
      await user.save();
      Response(res, 404, false, "token het han");
    } else {
      user.password = req.body.newpassword;
      user.forgotPasswordToken = "";
      user.forgotPasswordTokenExp = 0;
      await user.save();
      Response(res, 200, true, "doi pass thanh cong");
    }
  } else {
    Response(res, 404, false, "token khong ton tai");
  }

})
// Thêm route upload avatar
router.post('/upload-avatar',
  Authentication,
  uploadAFileWithField('avatar'),
  async function (req, res, next) {
    try {
      if (!req.file) {
        return Response(res, 400, false, "No file uploaded or invalid file type");
      }

      const avatarURL = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
      let user = await users.findById(req.userId);
      user.avatarURL = avatarURL;
      await user.save();

      Response(res, 200, true, {
        message: "Avatar updated successfully",
        avatarURL: avatarURL
      });
    } catch (error) {
      Response(res, 500, false, error.message);
    }
  }
);

function GenerateRandomString(length) {
  let result = "";
  let source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let index = 0; index < length; index++) {
    let random = Math.floor(Math.random() * source.length);
    result += source.charAt(random);
  }
  return result;
}


module.exports = router;
