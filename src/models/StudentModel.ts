import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface StudentSchemaInterface extends Document {
	name: string;
	phoneNo: string[]|null;
	picture: string|null;
	subjects: string[]|null;
	batches?: ObjectId[];
    admissionNo: string;
    presents?:number;
    clg:boolean;
    stream:string;
    fees:number;
    _id?:string;
}
const StudentSchema:Schema<StudentSchemaInterface> = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    phoneNo: {
        type: [String],
        required: [true, 'At least one phone number is required'],
    },
    picture: {
        type: String,
        required: [true, 'Picture is required'],
    },
    subjects: {
        type: [String],
        required: [true, 'At least one subject is required'],
    },
    batches: {
        type: [mongoose.Types.ObjectId],
        ref: 'batches', 
    },
    admissionNo: {
        type: String,
        required: [true, 'Admission number is required'],
    },
    presents: {
        type: Number,
        default:0
    },
    clg: {
        type: Boolean,
        required: [true, 'Clg is required'],
    },
    stream: {
        type: String,
        required: [true, 'Stream is required'],
    },
    fees: {
        type: Number,
        required: [true, 'Fees is required'],
    }
});

const studentModel=(mongoose.models.students as mongoose.Model<StudentSchemaInterface>)||mongoose.model<StudentSchemaInterface>("students",StudentSchema);

export default studentModel;