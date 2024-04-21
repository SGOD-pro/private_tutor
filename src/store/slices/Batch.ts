import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BatchInterface {
	_id: string;
	batchName: string;
	startTime: string;
	endTime: string;
	days: string;
	subject: string;
}

const initialState: { allBatches: BatchInterface[] } = {
	allBatches: [
		{
			_id: "",
			batchName: "",
			startTime: "",
			endTime: "",
			days: '',
			subject: "",
		},
	],
};

export const batchSlice = createSlice({
	name: "batch",
	initialState,
	reducers: {
		setAllBatches: (state: any, action: PayloadAction<BatchInterface[]>) => {
			state.allBatches = action.payload;
		},
		pushBatches: (state: any, action: PayloadAction<BatchInterface>) => {
			state.allBatches.push(action.payload);
		},
		popBatches: (state, action: PayloadAction<string>) => {
			state.allBatches = state.allBatches.filter(
				(student) => student._id !== action.payload
			);
		},
		updateBatches: (state, action) => {
			state.allBatches = state.allBatches.map((items) =>
				items._id === action.payload._id ? action.payload : items
			);
		},
	},
});

export const { setAllBatches, popBatches, pushBatches, updateBatches } =
	batchSlice.actions;
export default batchSlice.reducer;
