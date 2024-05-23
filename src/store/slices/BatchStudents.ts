import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export interface BatchStudentInterface{
    admissionNo:string;
    name:string;
    _id?:string;
    subjects:string;
}
const initialState:{allStudentsByBatch:BatchStudentInterface[]}={
    allStudentsByBatch:[]
}

const batchStudentsSlice=createSlice({
    name: "batchStudent",
    initialState,
    reducers:{
        setAllStudentsByBatch: (state, action: PayloadAction<BatchStudentInterface[]>) => {
            state.allStudentsByBatch = action.payload;
        },
        addStudentsToBatch: (state, action: PayloadAction<BatchStudentInterface[]>) => {
            state.allStudentsByBatch = [...state.allStudentsByBatch, ...action.payload];
          }
    }
});

export const { setAllStudentsByBatch,addStudentsToBatch } = batchStudentsSlice.actions;

export default batchStudentsSlice.reducer;
