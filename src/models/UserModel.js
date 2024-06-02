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
        unique: [true,"Admission No is not unique."],
        required: true,
    },
    picture: {
        type: String,
    },
    presents: {
        type: Number,
        default: 0,
    },
    batches:[{
        type: Schema.Types.ObjectId,
        ref:"batches",
        default:[]
    }]
}, { timestamps: true })

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User