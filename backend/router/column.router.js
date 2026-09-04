import { Router } from "express"
import { body } from "express-validator"

import { updateColName, deleteCol, createColTask } from "../controllers/column.controller.js"
import { validateInput, isUserLoggedIn } from "../middleware/validation.middleware.js";


const columnRoute = Router();

columnRoute.use(isUserLoggedIn);

columnRoute.put(
    '/:id',
    body('name').notEmpty().withMessage("Name is Required"),
    validateInput,
    updateColName
);

columnRoute.delete(
    '/:id',
    deleteCol
);

columnRoute.post(
    '/:id/tasks',
    body('name').notEmpty().withMessage("Name is Required"),
    body('description').notEmpty().withMessage("Description is Required"),
    body('priority').notEmpty().withMessage("Priority is Required"),
    body('order').notEmpty().withMessage("Order is Required"),
    body('dueDate').notEmpty().withMessage("Due Date is Required"),
    body('assignedTo').notEmpty().withMessage("Who is it assigned to?"),
    validateInput,
    createColTask
)

export default columnRoute;