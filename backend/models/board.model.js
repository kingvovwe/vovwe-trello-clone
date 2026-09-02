import { model, Schema } from "mongoose";


const boardSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]

},
{
    timestamps: true
})


export const SBoard = model('Board', boardSchema);