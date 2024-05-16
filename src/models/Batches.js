import mongoose, { Schema } from "mongoose";

const batchSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: [true, "Please enter time."]
    },
    startTime: {
        type: String,
        required: [true, "Please enter time."]
    },
    days: {
        type: Array,
        default: [],
        required: true
    }
})

const batches = mongoose.models.batches || mongoose.model("batches", batchSchema)

export default batches