import mongoose, { Schema, Document, ObjectId, Types } from "mongoose";


interface Months{
	year:string[]
}
interface FeesInterface extends Document {
	studentId: ObjectId;
	month:Months[];
}

const feesSchama: Schema<FeesInterface> = new Schema(
	{
		studentId: Schema.Types.ObjectId,
		month:String
	},
	{ timestamps: true }
);

const feesModel =
	(mongoose.models.fees as mongoose.Model<FeesInterface>) ||
	mongoose.model<FeesInterface>("fees", feesSchama);

export default feesModel;
