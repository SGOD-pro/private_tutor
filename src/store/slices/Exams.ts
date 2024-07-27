import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ExamsInterface {
	date: string;
	_id?: string;
	batch_name: string;
	subject: string;
}
const initialState: { allExams: ExamsInterface[] } = {
	allExams: [],
};
export const createExamsSlice = createSlice({
	name: "allExams",
	initialState,
	reducers: {
		setAllExam: (state: any, action: PayloadAction<ExamsInterface[]>) => {
			state.allExams = action.payload;
		},
		pushExam: (state: any, action: PayloadAction<ExamsInterface>) => {
			state.allExams.push(action.payload);
		},
		popExam: (state, action: PayloadAction<string>) => {
			state.allExams = state.allExams.filter(
				(batch) => batch._id !== action.payload
			);
		},
		updateExam: (state, action) => {
			state.allExams = state.allExams.map((items) =>
				items._id === action.payload._id ? action.payload : items
			);
		},
	},
});
export const { setAllExam, pushExam, popExam, updateExam } =
	createExamsSlice.actions;

export default createExamsSlice.reducer;
