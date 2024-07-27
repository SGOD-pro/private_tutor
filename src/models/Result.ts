import mongoose, { Document, Schema, ObjectId } from "mongoose";

interface Marks extends Document {
	studentId: ObjectId;
	marks: number;
}
interface Result extends Document {
	examId: ObjectId;
	result: Result[];
}

const resutlSchema: Schema<Result> = new Schema({
	examId: {
		type: Schema.Types.ObjectId,
		ref: "exams",
	},
	result: [],
});
const resultModel =
	(mongoose.models.results as mongoose.Model<Result>) ||
	mongoose.model<Result>("results", resutlSchema);
export default resultModel;
