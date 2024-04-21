import { configureStore } from "@reduxjs/toolkit";
import Students from "./slices/Students";
import Subjects from "./slices/Subjects";
import Batches from "./slices/Batch";
const Store = configureStore({
	reducer: {
		Students,
		Subjects,
		Batches,
	},
});

export default Store;
