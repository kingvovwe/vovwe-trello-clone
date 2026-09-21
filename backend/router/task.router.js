import { Router } from "express"
import { body } from "express-validator"

import { validateInput, isUserLoggedIn } from "../middleware/validation.middleware.js";
import { getATask, updateATask, deleteATask } from "../controllers/task.controller.js";



const taskRoute = Router();

taskRoute.use(isUserLoggedIn);


taskRoute.get(
    '/:id',
    getATask
);

taskRoute.put(
    '/:id',
    updateATask
);

taskRoute.delete(
    '/:id',
    deleteATask
);


export default taskRoute;



