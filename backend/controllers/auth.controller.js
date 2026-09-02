import { genJwtToken, verifyToken, jsonRes } from "../utilities/helper.utilities.js"
import { hash, compare } from "bcrypt";

import { SUser } from "../models/user.model.js";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config/env.config.js";

export const login = async (req, res) => {
    try {

        console.log("Login")

        const { email, password } = req.body;

        const user = await SUser.findOne({ email });

        if(!user) {
            const errRes = jsonRes(false, `Incorrect Details`, null)
            res.status(400).json(errRes);
            return;
        }

        const isPassValid = await compare(password, user.password);

        if(!isPassValid) {
            const errRes = jsonRes(false, `Incorrect Details`, null)
            res.status(400).json(errRes);
            return;
        }

        const jwtPayload = {
            id: user._id
        };

        const accessToken = genJwtToken(jwtPayload, JWT_ACCESS_SECRET, "15m");
        const refreshToken = genJwtToken(jwtPayload, JWT_REFRESH_SECRET, '7d');

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            // sameSite: 'none',
            maxAge: 15 * 60 * 1000
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            // sameSite: 'none',
            maxAge: 7 * 60 * 60 * 24 * 1000
        })
        
        const successRes = jsonRes(true, `Welcome Back ${user.name}`, user);

        res.status(200).json(successRes);



    } catch (e) {
        const errRes = jsonRes(false, `Failed to login`, e.message)
        res.status(400).json(errRes);
    }
}

export const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const hashPass = await hash(password, 10);

        const user = await SUser.create({
            name, email, password: hashPass
        });


        const jwtPayload = {
            id: user._id
        };

        const accessToken = genJwtToken(jwtPayload, JWT_ACCESS_SECRET, "15m");
        const refreshToken = genJwtToken(jwtPayload, JWT_REFRESH_SECRET, '7d');

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            // sameSite: 'none',
            maxAge: 15 * 60 * 1000
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            // sameSite: 'none',
            maxAge: 7 * 60 * 60 * 24 * 1000
        })

        const successRes = jsonRes(true, `Successfully Registered ${name}`,  user);

        res.status(200).json(successRes);


    } catch (e) {
        const errRes = jsonRes(false, `Failed to register`, e.message)
        res.status(400).json(errRes);
    }
}

export const refreshToken = async (req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) {
            console.log(req.cookies);
            const errRes = jsonRes(false, `Not Logged In`, null)
            res.status(400).json(errRes);
            return;
        }

        const isTokenValid = verifyToken(refreshToken, JWT_REFRESH_SECRET);

        if(!isTokenValid) {
            const errRes = jsonRes(false, `Invalid Token`, null)
            res.status(400).json(errRes);
            return;
        }

        const jwtPayload = {
            id: isTokenValid.id
        };

        const accessToken = genJwtToken(jwtPayload, JWT_ACCESS_SECRET, '15m');

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            // sameSite: 'none',
            maxAge: 15 * 60 * 1000
        });

        
        const successRes = jsonRes(true, `Access Token Refreshed ${accessToken}`, null);
        res.status(200).json(successRes);




    } catch (e) {
        const errRes = jsonRes(false, `Failed to refresh token`, e.message)
        res.status(400).json(errRes);
    }
}