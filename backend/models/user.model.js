import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        unique: true,
        type: String,
    },
    password: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

export const SUser = model('User', userSchema);

