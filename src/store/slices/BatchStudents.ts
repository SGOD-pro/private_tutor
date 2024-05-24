import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BatchStudentInterface {
	admissionNo: string;
	name: string;
	_id?: string;
	subjects: string;
}
const initialState: { allStudentsByBatch: BatchStudentInterface[] } = {
	allStudentsByBatch: [],
};

const batchStudentsSlice = createSlice({
	name: "batchStudent",
	initialState,
	reducers: {
		setAllStudentsByBatch: (
			state,
			action: PayloadAction<BatchStudentInterface[]>
		) => {
			state.allStudentsByBatch = action.payload;
		},
		pushStudentByBatch: (
			state,
			action: PayloadAction<BatchStudentInterface>
		) => {
			state.allStudentsByBatch = [ action.payload,...state.allStudentsByBatch];
		},
		addStudentsToBatch: (
			state,
			action: PayloadAction<BatchStudentInterface[]>
		) => {
			state.allStudentsByBatch = [
				...state.allStudentsByBatch,
				...action.payload,
			];
		},
	},
});

export const { setAllStudentsByBatch, addStudentsToBatch,pushStudentByBatch } =
	batchStudentsSlice.actions;

export default batchStudentsSlice.reducer;
