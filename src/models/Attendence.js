import mongoose, { Schema } from "mongoose";

const attendenceSchema = new Schema({
    batchId: {
        type: Schema.Types.ObjectId,
        ref: 'batches',
        require: true,
    },
    studentsId: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }]
}, { timestamps: true });


const Attendence = mongoose.models.attendences || mongoose.model("attendences", attendenceSchema);
export default Attendence