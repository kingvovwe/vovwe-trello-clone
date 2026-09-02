import { model, Schema } from "mongoose"


const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    columnID: {
        type: Schema.Types.ObjectId,
        ref: "Column"
    },
    boardID: {
        type: Schema.Types.ObjectId,
        ref: "Board",
        required: true
    },
    order: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: Date
    },
    priority: {
        type: String,
        enum: ["urgent", "high", "medium", "low"]
    },
    assignedTo: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
},
{
    timestamps: true
});

export const STask = model("Task", taskSchema);