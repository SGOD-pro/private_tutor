import mongoose, { Schema } from "mongoose";

const asignmentSchema = Schema({
    title: {
        type: String,
        require: true,
    },
    explanation: {
        type: String,
    },
    batch: {
        type: Schema.Types.ObjectId,
        ref:"batches",
        require: true,
    },
    subbmissionDate: {
        type: Date,
        require: true,
    }
}, { timestamps: true })

const Assignment=mongoose.models.assignments||mongoose.model("assignments",asignmentSchema)

export default Assignment;