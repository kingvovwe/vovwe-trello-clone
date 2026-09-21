import { validationResult } from "express-validator"
import { jsonRes, verifyToken } from "../utilities/helper.utilities.js";
import { JWT_ACCESS_SECRET } from "../config/env.config.js";
import { SUser } from "../models/user.model.js";

export const validateInput = (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {

        const errRes = jsonRes(false, "Validation Error", errors.array());

        res.status(400).json(errRes);

        return;

    }

    next();
}

export const isUserLoggedIn = async (req, res, next) => {
    try {

        const accessToken = req.cookies.accessToken;

        if(!accessToken) {
            const errRes = jsonRes(false, `Please Login`, null);
            res.status(400).json(errRes);
            return;
        }

        const isTokenValid = verifyToken(accessToken, JWT_ACCESS_SECRET);

        if(!isTokenValid) {
            const errRes = jsonRes(false, `Please Login`, null);
            res.status(400).json(errRes);
            return;
        }

        const user = await SUser.findById(isTokenValid.id);

        if(!user) {
            const errRes = jsonRes(false, `No such User. Create Account`, null);
            res.status(400).json(errRes);
            return;
        }

        req.user = user;

        next();


    } catch (e) {
        const errRes = jsonRes(false, `Failed to verify User`, e.message)
        res.status(400).json(errRes);
        return;
    }
}

