import { jsonRes } from "../utilities/helper.utilities.js"

import { SBoard } from "../models/board.model.js";
import { SColumn } from "../models/column.model.js";
import { STask } from "../models/task.model.js";


export const createBoard = async (req, res) => {
    try {

        const { name } = req.body;
        const owner = req.user._id;

        const members = [owner];

        const board = await SBoard.create({
            name, owner, members
        });

        if(!board) {
            const errRes = jsonRes(false, `Failed to create board`, null)
            res.status(400).json(errRes);
            return;
        }

        const columnsData = [
            {
                name: "to-do",
                boardID: board._id,
                order: 0
            },
            {
                name: "in-progress",
                boardID: board._id,
                order: 1
            },
            {
                name: "in-review",
                boardID: board._id,
                order: 2
            },
            {
                name: "done",
                boardID: board._id,
                order: 3
            }
        ];

        const columns = await SColumn.insertMany(columnsData)

        const succRes = jsonRes(true, `Board ${name} created`, { board, columns });
        res.status(200).json(succRes);


    } catch (e) {
        const errRes = jsonRes(false, `Failed to create board`, e.message)
        res.status(400).json(errRes);
    }
}

export const getBoards = async (req, res) => {
    try {

        const { search } = req.query;

        const userId = req.user._id;

        const filter = {
            $or: [
                { owner: userId },
                { members: userId }
            ]
        }

        if(search) {

            filter.name = {
                $regex: search,
                $options: "i"
            }
            
        }


        const boards = await SBoard.find(filter);

        const succRes = jsonRes(true, `Got all Boards`, { boards, total: boards.length });
        res.status(200).json(succRes);

    } catch (e) {
        const errRes = jsonRes(false, `Failed to get all boards`, e.message)
        res.status(400).json(errRes);
    }
}

export const getABoardAndChildren = async (req, res) => {
    try {

        const { id } = req.params;
        const userId = req.user._id;

        const board = await SBoard.findOne({
            _id: id,
            $or: [
                { owner: userId },
                { members: userId },
            ]
        }).lean();
        
        if(!board) {
            const errRes = jsonRes(false, `No Such Board`, null)
            res.status(400).json(errRes);
            return;
        }

        const [ columns, tasks ] = await Promise.all([
            SColumn.find({ boardID: id }).sort({ order: 1 }).lean(),
            STask.find({ boardID: id }).sort({ order: 1 }).lean()
        ]);

        const colsWithTasks = columns.map(col => {
            return {
                ...col,
                tasks: tasks.filter(task => task.columnID === col._id)
            }
        });

        const resPayload = {
            ...board,
            columns: colsWithTasks
        }


        const succRes = jsonRes(true, "Board Details Loaded", resPayload);
        res.status(200).json(succRes);



    } catch (e) {
        const errRes = jsonRes(false, `Failed to get the board`, e.message)
        res.status(400).json(errRes);
    }
}

export const updateBoard = async (req, res) => {
    try {

        const boardId = req.params.id;

        const { name } = req.body;
        const userId = req.user._id;

        const board = await SBoard.findOne({
            _id: boardId, owner: userId, 
        });

        if(!board) {
            const errRes = jsonRes(false, `Sorry Could not get Board`, null)
            res.status(400).json(errRes);
            return;
        }

        if (name) {
            board.name = name;
        }

        await board.save();
        
        const succRes = jsonRes(true, `Board Updated Successfully`, board);
        res.status(200).json(succRes);


    } catch (e) {
        const errRes = jsonRes(false, `Failed to update board`, e.message)
        res.status(400).json(errRes);
    }
}

export const deleteBoard = async (req, res) => {
    try {

        const { id } = req.params;
        const userId = req.user._id;

        const board = await SBoard.deleteOne({ _id: id, owner: userId });
        const columns = await SColumn.deleteMany({ boardID: id });
        const tasks = await STask.deleteMany({ boardID: id });

        if(board.deletedCount === 0) {
            const errRes = jsonRes(false, `Board not Found or Not the owner`, null);
            res.status(400).json(errRes);
            return;
        }

        const succRes = jsonRes(true, `Board Deleted Successfully`, { board, columns, tasks });
        res.status(200).json(succRes);


    } catch (e) {
        const errRes = jsonRes(false, `Failed to delete board`, e.message)
        res.status(400).json(errRes);
    }
}


export const createColumn = async (req, res) => {
    try {

        const { id } = req.params;

        const userId = req.user._id;

        const board = await SBoard.findOne({
            _id: id,
            $or: [
                { owner: userId },
                { members: userId }
            ]
        });

        if(!board) {
            const errRes = jsonRes(false, `Please create a board first`, null)
            res.status(400).json(errRes);
            return;
        }

        const { name } = req.body;

        const lastCol = await SColumn.findOne({ boardID: id })
                                    .sort({ order: -1 }).lean();

        // console.log(lastCol);

        const newOrder = lastCol ? lastCol.order + 1 : 0;

        const column = await SColumn.create({
            name, boardID: id, order: newOrder
        });

        const succRes = jsonRes(true, "Column created successfully", { column, lastCol });
        res.status(200).json(succRes);


    } catch (e) {
        const errRes = jsonRes(false, `Failed to create column`, e.message)
        res.status(400).json(errRes);
    }
}


export const updateColOrder = async (req, res) => {
    try {

        const boardID = req.params.id;

        const board = await SBoard.findById(boardID);

        if(!board) {
            const errRes = jsonRes(false, `Please create a Board`, null)
            res.status(400).json(errRes);
            return;
        }

        const { newColOrders } = req.body;

        if(!newColOrders || !Array.isArray(newColOrders)) {
            const errRes = jsonRes(false, `Invalid data format`, null)
            res.status(400).json(errRes);
            return;
        }

        const bulkOptions = newColOrders.map((col) => {
            return {
                updateOne: {
                    filter: { _id: col.id, boardID },
                    update: { $set: { order: col.order } }
                }
            }
        });

        await SColumn.bulkWrite(bulkOptions);

        const succRes = jsonRes(true, "Column Order Updated", null);
        res.status(200).json(succRes);



    } catch (e) {
        const errRes = jsonRes(false, `Failed to change column order`, e.message)
        res.status(400).json(errRes);
    }
}
