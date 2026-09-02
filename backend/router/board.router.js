import { Router } from "express"
import { body } from "express-validator"

import { validateInput, isUserLoggedIn } from "../middleware/validation.middleware.js";
import { createBoard, createColumn, getBoards, getABoardAndChildren, updateBoard, deleteBoard } from "../controllers/board.controller.js";


const boardRoute = Router();


boardRoute.use(isUserLoggedIn);

boardRoute.post(
    '/',
    body('name').notEmpty().withMessage("Name is Required"),
    validateInput,
    createBoard
);

boardRoute.post(
    '/:id/columns',
    body('name').notEmpty().withMessage("Name is Required"),
    validateInput,
    createColumn
)

boardRoute.get(
    '/',
    getBoards
);


boardRoute.get(
    '/:id',
    getABoardAndChildren
);

boardRoute.put(
    '/:id',
    updateBoard
);

boardRoute.delete(
    '/:id',
    deleteBoard
);



export default boardRoute;