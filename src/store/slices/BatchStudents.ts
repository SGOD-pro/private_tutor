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
			state.allStudentsByBatch = [action.payload, ...state.allStudentsByBatch];
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
		updateStudentsToBatch: (
			state,
			action: PayloadAction<BatchStudentInterface>
		) => {
			for (let index = 0; index < state.allStudentsByBatch.length; index++) {
				if (state.allStudentsByBatch[index]._id === action.payload._id) {
					state.allStudentsByBatch[index] = action.payload;
					break;
				}
			}
		},
	},
});

export const { setAllStudentsByBatch, addStudentsToBatch, pushStudentByBatch,updateStudentsToBatch } =
	batchStudentsSlice.actions;

export default batchStudentsSlice.reducer;
