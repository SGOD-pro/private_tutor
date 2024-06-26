import { configureStore } from "@reduxjs/toolkit";
import Students from "./slices/Students";
import Subjects from "./slices/Subjects";
import Batches from "./slices/SubjectBatch";
import Assignments from "./slices/Assignments";
import BatchStudents from "./slices/BatchStudents";
import Toast from "./slices/Toast";

const store = configureStore({
	reducer: {
		Students,
		Subjects,
		Batches,
		Assignments,
		BatchStudents,
		toast: Toast,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;