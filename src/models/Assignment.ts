import mongoose, { Schema, Document, Model } from "mongoose";

interface IAssignment extends Document {
    title: string;
    explanation?: string;
    batch: mongoose.Types.ObjectId;
    submissionDate: Date;
}

const assignmentSchema = new Schema<IAssignment>({
    title: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
    },
    batch: {
        type: Schema.Types.ObjectId,
        ref: "batches",
        required: true,
    },
    submissionDate: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

const Assignment: Model<IAssignment> = mongoose.models.assignments || mongoose.model<IAssignment>("assignments", assignmentSchema);

export default Assignment;
