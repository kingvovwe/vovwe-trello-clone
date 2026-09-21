import { verifyToken } from "../utilities/helper.utilities.js";
import { SUser } from "../models/user.model.js";
import { JWT_ACCESS_SECRET } from "../config/env.config.js";




export const isSocketUserLoggedIn = async (socket, next) => {

    const cookies = socket.handshake.headers.cookie;
        
    if(!cookies) {
        console.log("Please login");
        return next(new Error("Authenticatio Error: No Cookies"))
    }
    const tokenString = cookies.split(';').find(c => c.trim().startsWith('accessToken='));
        
    if(!tokenString) {
        console.log("No token String");
        return next(new Error("Missing Login Token"));
    }
        
    const token = tokenString.split('=')[1];
                
    const isTokenValid = verifyToken(token, JWT_ACCESS_SECRET);
        
    if(!isTokenValid) {
       return next(new Error("Please Login"));
    }

    const user = await SUser.findById(isTokenValid.id);

    // console.log(user);

    socket.user = user;
        
    next();

}