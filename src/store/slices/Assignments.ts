import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddAssignmentInterface } from "@/app/assignment/AddAssignment";

const initialState: { allAssignments: AddAssignmentInterface[] } = {
	allAssignments: [
		{
			title: "",
			explanation: "",
			batch: null,
			subbmissionDate: null,
			_id: "",
		},
	],
};

export const assignmentSlice = createSlice({
	name: "assignmentSlice",
	initialState,
	reducers: {
		setAllAssignment: (
			state: any,
			action: PayloadAction<AddAssignmentInterface[]>
		) => {
			state.allAssignments = action.payload;
		},
		pushAssignment: (
			state: any,
			action: PayloadAction<AddAssignmentInterface>
		) => {
			state.allAssignments.push(action.payload);
		},
		popAssignment: (state, action: PayloadAction<string>) => {
			state.allAssignments = state.allAssignments.filter(
				(batch) => batch._id !== action.payload
			);
		},
		updateAssignment: (state, action) => {
			state.allAssignments = state.allAssignments.map((items) =>
				items._id === action.payload._id ? action.payload : items
			);
		},
	},
});

export const {
	setAllAssignment,
	pushAssignment,
	popAssignment,
	updateAssignment,
} = assignmentSlice.actions;

export default assignmentSlice.reducer;
