import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BatchInterface {
	_id: string;
	time: string;
	days: string;
	subject: string;
}

const initialState: { allBatches: BatchInterface[] } = {
	allBatches: [],
};

export const batchSlice = createSlice({
	name: "batch",
	initialState,
	reducers: {
		setAllBatches: (state: any, action: PayloadAction<BatchInterface[]>) => {
			state.allBatches = action.payload;
		},
		pushBatches: (state: any, action: PayloadAction<BatchInterface>) => {
			state.allBatches = [action.payload, ...state.allBatches];
		},
		popBatches: (state, action: PayloadAction<string>) => {
			state.allBatches = state.allBatches.filter(
				(batch) => batch._id !== action.payload
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
