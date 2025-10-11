let { body,validationResult } = require("express-validator");
let {Response} = require('./responseHandler')
let constants = require('./constants')
let util = require('util')
const { MESSAGE_ERROR_VALIDATOR_PASSWORD } = require("./constants")
let options = {
    optionPassword: {
        minLength: 8,
        minNumbers: 1,
        minLowercase: 1,
        minSymbols: 1,
        minUppercase: 1
    }
}

module.exports = {
    validatorRegister: [
        body("email").isEmail().withMessage(constants.MESSAGE_ERROR_VALIDATOR_EMAIL),
        body("password").isStrongPassword(options.optionPassword).withMessage(util.format(MESSAGE_ERROR_VALIDATOR_PASSWORD,
            options.optionPassword.minLength,
            options.optionPassword.minSymbols,
            options.optionPassword.minLowercase,
            options.optionPassword.minUppercase,
            options.optionPassword.minNumbers
        )),
        body("username").isAlphanumeric().withMessage(constants.MESSAGE_ERROR_VALIDATOR_USERNAME)
    ],
    validatorChangpassword: [
        body("newpassword").isStrongPassword(options.optionPassword).withMessage(util.format(MESSAGE_ERROR_VALIDATOR_PASSWORD,
            options.optionPassword.minLength,
            options.optionPassword.minSymbols,
            options.optionPassword.minLowercase,
            options.optionPassword.minUppercase,
            options.optionPassword.minNumbers
        ))
    ],
    validatorAvatar: [
        body("avatarURL")
            .isURL()
            .withMessage("Avatar URL must be a valid URL")
    ],
    validatedResult: function (req, res, next) {
        let result = validationResult(req);
        console.log(result);
        if (result.errors.length > 0) {
            Response(res, 404, false, result);
        } else {
            next();
        }
    }
}