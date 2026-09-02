import { SColumn } from "../models/column.model.js";
import { jsonRes } from "../utilities/helper.utilities.js";

export const getCols = async (req, res) => {
    try {

        const boardID = req.params.id;

        const columns = await SColumn.find({ boardID });

        if(!columns) {
            const errRes = jsonRes(false, `No Column Exists`, null)
            res.status(400).json(errRes);
            return;
        }

        const successRes = jsonRes(true, "Columns Gotten", columns);
        res.status(200).json(successRes);



    } catch (e) {
        const errRes = jsonRes(false, `Failed to get columns`, e.message)
        res.status(400).json(errRes);
    }
}