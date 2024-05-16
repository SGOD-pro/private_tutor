import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StudentData {
	admissionNo: string | null;
	fullname: string;
	subjects: string;
	_id: string;
	profilePicture: string;
}

const initialState: { allStudents: StudentData[] } = {
	allStudents: [
		{
			admissionNo: null,
			fullname: "",
			subjects: "",
			_id: "",
			profilePicture: "",
		},
	],
};

export const studentSlice = createSlice({
	name: "Student",
	initialState,
	reducers: {
		setAllStudents: (state, action: PayloadAction<StudentData[]>) => {
			state.allStudents = action.payload;
		},
		pushStudent: (state, action: PayloadAction<StudentData>) => {
			state.allStudents=[action.payload,...state.allStudents];
			
		},
		popStudent: (state, action: PayloadAction<string>) => {
			state.allStudents = state.allStudents.filter(
				(student) => student._id !== action.payload
			);
		},
		updateStudent: (state, action) => {
			state.allStudents = state.allStudents.map((items) =>
				items._id === action.payload._id ? action.payload : items
			);
		},
	},
});

export const { setAllStudents, pushStudent, updateStudent,popStudent } =studentSlice.actions;
export default studentSlice.reducer;
