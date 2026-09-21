import { STask } from "../models/task.model.js";
import { jsonRes } from "../utilities/helper.utilities.js";

export const getATask = async (req, res) => {
    try {

        const taskID = req.params.id;

        const task = await STask.findById(taskID);

        if(!task) {
            const errRes = jsonRes(false, `No Such Task`, null)
            res.status(400).json(errRes);
            return;
        }

        const succRes = jsonRes(true, "View Task", task);
        res.status(200).json(succRes);
        
    } catch (e) {
        const errRes = jsonRes(false, `Failed to get task`, e.message)
        res.status(400).json(errRes);
    }
}






export const updateATask = async (req, res) => {
    try {

        const taskID = req.params.id;

        const task = await STask.findById(taskID);

        if(!task) {
            const errRes = jsonRes(false, `No Such Task`, null)
            res.status(400).json(errRes);
            return;
        }

        const { title, description, order, dueDate, priority, assignedTo } = req.body;

        if(title) {
            task.title = title;
        }

        if(description) {
            task.description = description;
        }

        if(order) {
            task.order = order;
        }

        if(dueDate) {
            task.dueDate = dueDate;
        }

        if(priority) {
            task.priority = priority;
        }

        if(assignedTo) {
            task.assignedTo = assignedTo;
        }

        await task.save();

        const succRes = jsonRes(true, "View Task", task);
        res.status(200).json(succRes);
        
    } catch (e) {
        const errRes = jsonRes(false, `Failed to get task`, e.message)
        res.status(400).json(errRes);
    }
}


export const updateTaskCol = async (req, res) => {
    try {

        const taskID = req.params.id;

        const task = await STask

        if(task.deletedCount === 0) {
            const errRes = jsonRes(false, `Couldn't delete Task`, null)
            res.status(400).json(errRes);
            return;
        }

        const succRes = jsonRes(true, "Task Deleted", task);
        res.status(200).json(succRes);
        
    } catch (e) {
        const errRes = jsonRes(false, `Failed to change task column`, e.message)
        res.status(400).json(errRes);
    }
}


export const deleteATask = async (req, res) => {
    try {

        const taskID = req.params.id;

        const task = await STask.deleteOne({ _id: taskID });

        if(task.deletedCount === 0) {
            const errRes = jsonRes(false, `Couldn't delete Task`, null)
            res.status(400).json(errRes);
            return;
        }

        const succRes = jsonRes(true, "Task Deleted", task);
        res.status(200).json(succRes);
        
    } catch (e) {
        const errRes = jsonRes(false, `Failed to delete task`, e.message)
        res.status(400).json(errRes);
    }
}


