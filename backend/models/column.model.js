import { model, Schema } from "mongoose"


const columnSchema = new Schema({
    name: {
        type: String,
        required: true
        // enum: ["to-do", "in-progress", "in-review", "done"],
        // default: "to-do"
    },
    boardID: {
        type: Schema.Types.ObjectId,
        ref: 'Board'
    },
    order: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
});

export const SColumn = model("Column", columnSchema);