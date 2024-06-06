import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for your state
interface SubjectItems {
	_id: string;
	subject: string | null;
}
interface SubjectState {
	allSubjects: SubjectItems[];
}
// Define the initial state
const initialState: SubjectState = {
	allSubjects: [],
};

// Create your slice
export const subjectSlice = createSlice({
	name: "subjects",
	initialState,
	reducers: {
		setSubject: (state: any, action: PayloadAction<SubjectState>) => {
			state.allSubjects=action.payload;
		},
		pushSubject: (state: any, action: PayloadAction<SubjectState>) => {
			state.allSubjects.push(action.payload);
		},
		popSubject: (state: any, action: PayloadAction<{_id:string}>) => {
			state.allSubjects = state.subjects.filter(
				(item: any) => item._id !== action.payload
			);
		},
	},
});

export const { setSubject, pushSubject, popSubject } = subjectSlice.actions;
export default subjectSlice.reducer;
