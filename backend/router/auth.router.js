import { Router } from "express";
import { body } from "express-validator";

import { login, refreshToken, register } from "../controllers/auth.controller.js";

import { validateInput } from "../middleware/validation.middleware.js";

const authRoute = Router();

authRoute.post(
    '/login',
    body('username').notEmpty().withMessage("Username is Required"),
    body('password').isLength({ min: 6 }).withMessage("Password must be 6 characters"),
    validateInput,
    login
);


authRoute.post(
    '/register',
    body('name').notEmpty().withMessage("Username is required"),
    body('email').notEmpty().isEmail().withMessage("Please enter valid Email"),
    body('username').notEmpty().withMessage("Username is required"),
    body('password').isLength({ min: 6 }).withMessage("Password must be 6 characters or more"),
    validateInput,
    register
);

authRoute.get(
    '/refresh-token',
    refreshToken
)


export default authRoute;

