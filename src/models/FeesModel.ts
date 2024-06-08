import mongoose, { Schema, Document, ObjectId, Types } from "mongoose";

interface FeesInterface extends Document {
	studentId: ObjectId;
}

const feesSchama: Schema<FeesInterface> = new Schema(
	{
		studentId: Schema.Types.ObjectId,
	},
	{ timestamps: true }
);

const feesModel =
	(mongoose.models.fees as mongoose.Model<FeesInterface>) ||
	mongoose.model<FeesInterface>("fees", feesSchama);

export default feesModel;
