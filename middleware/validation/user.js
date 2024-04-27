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
      console.log("Password:", req.body.password);
      console.log("Confirm Password:", value);
      if (value !== req.body.password) {
        throw new Error("Both passwords are not matching!");
      }
      return true;
    }),

  check("number").trim().not().isEmpty(),
];

exports.userValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().forEach((error) => {
    extractedErrors.push({ [error.param]: error.msg });
  });

  // If there's a specific error for confirmPassword, send it back
  const confirmPasswordError = extractedErrors.find(
    (error) => Object.keys(error)[0] === "confirmPassword"
  );
  if (confirmPasswordError) {
    return res.status(400).json({
      success: false,
      message: confirmPasswordError["confirmPassword"],
    });
  }

  // Otherwise, send the first error encountered
  const firstError = extractedErrors[0];
  res.status(400).json({
    success: false,
    message: firstError[Object.keys(firstError)[0]],
  });
};

exports.validateUserSignIn = [
  check("email").trim().isEmail().withMessage("email/password is required!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email/password is required!"),
];
