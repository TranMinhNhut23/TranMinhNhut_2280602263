var express = require('express');
var router = express.Router();
let users = require('../schemas/users');
let roles = require('../schemas/roles');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken')
let { Response } = require('../utils/responseHandler')
let { Authentication, Authorization } = require('../utils/authHandler')
let { validatorRegister, validatorChangpassword, validatedResult, validatorAvatar } = require('../utils/validator')


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
  let username = req.body.username;
  let password = req.body.password;
  let user = await users.findOne({
    username: username
  })
  if (user.length == 0) {
    Response(res, 404, false, "user khong ton tai");
    return;
  } else {
    let result = bcrypt.compareSync(password, user.password);
    if (result) {
      let token = jwt.sign({
        _id: user._id,
        exp: Date.now() + 15 * 60 * 1000
      }, "NNPTUD");
      res.cookie("token", "Bearer " + token, {
        httpOnly: true,
        maxAge: 60 * 1000 * 60 * 24 * 7
      })
      Response(res, 200, true, token);
    } else {
      Response(res, 403, false, "user sai password");
    }
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
router.post('/change-avatar',
    Authentication,
    validatorAvatar,
    validatedResult,
    async function (req, res, next) {
        try {
            let user = await users.findById(req.userId);
            user.avatarURL = req.body.avatarURL;
            await user.save();
            Response(res, 200, true, "Avatar updated successfully");
        } catch (error) {
            Response(res, 500, false, "Error updating avatar");
        }
    }
);


module.exports = router;
