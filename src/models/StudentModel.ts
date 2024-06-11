import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface Presentbatch extends Document {
	batchId: ObjectId;
	presents: number;
}
const PresentByBatchSchema: Schema<Presentbatch> = new Schema({
	batchId: {
		type: Schema.Types.ObjectId,
		ref: "batches",
		required: [true, "Cannot get batch id for count presents"],
	},
	presents: {
		type: Number,
		default: 0,
	},
});
export interface StudentSchemaInterface extends Document {
	name: string;
	phoneNo: string[] | null;
	picture: string | null;
	subjects: string[] | null;
	batches?: ObjectId[];
	presentByBathch: Presentbatch[];
	institutionName: string;
	admissionNo: string;
	presents?: number;
	clg: boolean;
	stream: string;
	fees: number;
	_id?: string;
}

const StudentSchema: Schema<StudentSchemaInterface> = new Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		institutionName: {
			type: String,
			required: [true, "Institution name is required"],
		},
		phoneNo: {
			type: [String],
			required: [true, "At least one phone number is required"],
		},
		picture: {
			type: String,
		},
		subjects: {
			type: [String],
			required: [true, "At least one subject is required"],
		},
		batches: {
			type: [Schema.Types.ObjectId],
			ref: "batches",
		},
		presentByBathch: [PresentByBatchSchema],
		admissionNo: {
			type: String,
			required: [true, "Admission number is required"],
		},
		presents: {
			type: Number,
			default: 0,
		},
		clg: {
			type: Boolean,
			required: [true, "Clg is required"],
		},
		stream: {
			type: String,
			required: [true, "Stream is required"],
		},
		fees: {
			type: Number,
			required: [true, "Fees is required"],
		},
	},
	{ timestamps: true }
);

const studentModel =
	(mongoose.models.students as mongoose.Model<StudentSchemaInterface>) ||
	mongoose.model<StudentSchemaInterface>("students", StudentSchema);

export default studentModel;
