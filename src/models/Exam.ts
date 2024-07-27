import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { title } from "process";

export interface ExamInterface extends Document {
	title: string;
	caption: string;
	batch: string | ObjectId;
	date: Date;
	_id?: string;
	marks: number;
	online: boolean;
}

const examSchema: Schema<ExamInterface> = new Schema({
	title: {
		type: String,
		required: true,
	},
	caption: {
		type: String,
		required: true,
	},
	batch: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "batches",
	},
	date: {
		type: Date,
		required: true,
	},
	marks: {
		type:Number,
		default: 0,
		required: [true, "Please enter marks."],
	},
	online: {
		default: false,
		type: Boolean,
	},
});

const examModel =
	(mongoose.models.exams as mongoose.Model<ExamInterface>) ||
	mongoose.model<ExamInterface>("exams", examSchema);
export default examModel;