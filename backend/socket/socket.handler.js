import { verifyToken } from "../utilities/helper.utilities.js";
import { JWT_ACCESS_SECRET } from "../config/env.config.js";
import { SUser } from "../models/user.model.js";
import { SBoard } from "../models/board.model.js"
import { isSocketUserLoggedIn } from "../middleware/socket.middleware.js";

const connectedUsers = new Map();
let board;

export const initSocket = (io) => {

    io.use(isSocketUserLoggedIn);

    io.on("connection", (socket) => {

        const userId = socket.user._id.toString();

        console.log("Connected: ", socket.id);

        connectedUsers.set(userId, socket.id);

        console.log(connectedUsers);

        socket.on("send-msg", async (test) => {
            console.log(typeof test);
            const data = JSON.parse(test);

            console.log(data.msg);
            console.log(data.roomID);

            const receiverId = connectedUsers.get(data.roomID);

            io.to(receiverId).emit("receive-msg", data.msg);


        });

        socket.on("join-board", async (boardID) => {
            socket.join(boardID);

            board = await SBoard.findById(boardID);

            console.log(`User ${socket.user.name} joined ${boardID} the board ${board}`);
        });

        



    })
}
