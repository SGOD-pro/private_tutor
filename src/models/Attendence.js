import mongoose, { Schema } from "mongoose";

const attendenceSchema = new Schema({
    batchName: {
        type: 'string',
        require: true,
    },
    subject: {
        type: 'string',
        require: true,
    },
    studentsId: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }]
}, { timestamps: true });


const Attendence = mongoose.models.attendences || mongoose.model("attendences", attendenceSchema);
export default Attendence