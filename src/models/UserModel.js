import { timeStamp } from "console";
import mongoose, { Schema } from "mongoose";
const userSchema = Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    subject: {
        type: Array,
        required: true,
    },
    admissionNo: {
        type: String,
        unique: true,
        required: true,
    },
    picture: {
        type: String,
    },
    presents: {
        type: Number,
        default: 0,
    }
}, { timestamps: true })

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User