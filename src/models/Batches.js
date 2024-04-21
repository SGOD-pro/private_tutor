import mongoose, { Schema } from "mongoose";

const batchSchema = new Schema({
    batchName: {
        type: String,
        unique: true,
    },
    subject: {
        type: String,
    },
    endTime: {
        type: Date,
    },
    startTime: {
        type: Date,
    },
    days: {
        type: Array,
        default: []
    }
})

const batches = mongoose.models.batches || mongoose.model("batches", batchSchema)

export default batches