import { SBoard } from "../models/board.model.js";
import { SColumn } from "../models/column.model.js";
import { STask } from "../models/task.model.js";
import { jsonRes } from "../utilities/helper.utilities.js";

export const updateColName = async (req, res) => {
    try {

        const columnID = req.params.id;

        const column = await SColumn.findById(columnID);

        if(!column) {
            const errRes = jsonRes(false, `No such Column Exists`, null)
            res.status(400).json(errRes);
            return;
        }

        const { name } = req.body;

        column.name = name;

        await column.save();

        const successRes = jsonRes(true, "Column Name Updated", column);
        res.status(200).json(successRes);



    } catch (e) {
        const errRes = jsonRes(false, `Failed to update column`, e.message)
        res.status(400).json(errRes);
    }
}




export const deleteCol = async (req, res) => {
    try {

        const columnID = req.params.id;

        const column = await SColumn.deleteOne({ _id: columnID })

        if(column.deletedCount === 0) {
            const errRes = jsonRes(false, `No such Column Exists`, null)
            res.status(400).json(errRes);
            return;
        }


        const successRes = jsonRes(true, "Column Deleted Successfully", column);
        res.status(200).json(successRes);

    } catch (e) {
        const errRes = jsonRes(false, `Failed to delete column`, e.message)
        res.status(400).json(errRes);
    }
}






export const createColTask = async (req, res) => {
    try {

        const colID = req.params.id;

        const column = await SColumn.findById(colID);

        if(!column) {
            const errRes = jsonRes(false, `Please create Column First`, null);
            res.status(400).json(errRes);
            return;
        }

        const { title, description, order, priority, dueDate, assignedTo } = req.body;

        const task = await STask.create({
            title, description, columnID: colID, boardID: column.boardID,
            order, dueDate, priority, assignedTo
        });

        const succRes = jsonRes(true, "Successfully Created task", task);
        res.status(200).json(succRes);

    } catch (e) {
        const errRes = jsonRes(false, `Failed to create task`, e.message);
        res.status(400).json(errRes);
    }
}
