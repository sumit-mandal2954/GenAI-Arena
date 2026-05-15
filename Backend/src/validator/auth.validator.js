import { validationResult, body } from "express-validator";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: "Validation failed" });
  }
  next();
};

export const registerValidation = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters")
    .custom((value) => {
      if (/\s/.test(value)) {
        throw new Error("Username should not contain spaces");
      }
      return true;
    }).withMessage("Username validation failed"),
  body("email")
    .trim()
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .custom((value) => {
      if (/\s/.test(value)) {
        throw new Error("Password should not contain spaces");
      }
      return true;
    }).withMessage("Password validation failed"),
  validateRequest,
];

export const loginValidation = [
  body("email")
    .trim()
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required"),
  validateRequest,
];
