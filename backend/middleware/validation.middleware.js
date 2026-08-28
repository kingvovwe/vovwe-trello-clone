import { validationResult } from "express-validator"
import { jsonRes } from "../utilities/helper.utilities.js";

export const validateInput = (req, res, next) => {
    const errors = validationResult(req);
    console.log("Validate Input")
    if(!errors.isEmpty()) {

        const errRes = jsonRes(false, "Validation Error", errors.array());

        res.status(400).json(errRes);

        return;

    }

    next();
}

