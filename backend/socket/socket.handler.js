import { verifyToken } from "../utilities/helper.utilities.js";
import { JWT_ACCESS_SECRET } from "../config/env.config.js";
import { SUser } from "../models/user.model.js";
import { SBoard } from "../models/board.model.js"
import { isSocketUserLoggedIn } from "../middleware/socket.middleware.js";

const connectedUsers = new Map();
let board;

const liveBoardUsers = new Map();

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

        socket.on("join-board", async (boardID, callBack) => {

            try {

                const user = socket.user;
                board = await SBoard.findOne({
                    _id: boardID,
                    $or: [
                        { owner: user._id },
                        { members: user._id }
                    ]
                });

                if(!board) {
                    console.log("No such board");
                    return callBack({
                        success: false,
                        msg: "No such Board or Invalid Access",
                        data: null
                    });
                }

                socket.join(boardID);

                if(!liveBoardUsers.has(boardID)) {
                    liveBoardUsers.set(boardID, new Set());
                }

                liveBoardUsers.get(boardID).add(user._id.toString());

                
                callBack({
                    success: true,
                    msg: `User ${user.name} joined board`,
                    data: {
                        userId: user._id,
                        email: user.email
                    }
                });

                io.to(boardID).emit('user-joined-board', {
                    userId: user._id,
                    email: user.email
                });

                io.to(boardID).emit('live-board-users', {
                    users: [...liveBoardUsers.get(boardID)]
                });

                

                console.log(`Live Board Users: ${[...liveBoardUsers.get(boardID)]}`);


            } catch (e) {
                console.error("Join board error:", e.message);
                
                callBack({
                    success: false,
                    msg: "Error in Joining Board",
                    data: e.message
                })
            }
        });

        



    })
}
