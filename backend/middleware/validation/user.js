const { check, validationResult } = require("express-validator");

exports.validateUserSignUp = [
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please insert a username!")
    .isString()
    .withMessage("Please insert a valid username!"),
  check("lastName")
    .trim()
    .not()
    .isEmpty()
    .isString()
    .withMessage("Must be a valid name"),
  check("address").trim().not().isEmpty(),
  check("email").normalizeEmail().isEmail().withMessage("Invalid Email!"),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Please enter a password!")
    .isLength({ min: 8 })
    .withMessage("Password has to be at-least 8 characters long"),
  check("confirmPassword")
    .trim()
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Both passwords are not matching!");
      }
      return true;
    }),
  check("number").trim().not().isEmpty(),
];

exports.userValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error });
};

exports.validateUserSignIn = [
  check("email").trim().isEmail().withMessage("email/password is required!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email/password is required!"),
];
