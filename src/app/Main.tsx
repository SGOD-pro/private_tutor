"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllBatches } from "@/store/slices/Batch";
import { setSubject } from "@/store/slices/Subjects";
import axios from "axios";

function Main({ children }: { children: React.ReactNode }) {
	const subjects = useSelector((state: any) => state.Subjects.allSubjects);
	const batches = useSelector((state: any) => state.Batches.allBatches);
	const dispatch = useDispatch();

	useEffect(() => {
		if (
			subjects?.length > 0 &&
			(!subjects[0].subject || subjects[0].subject.trim() === "")
		) {
			axios
				.get("/api/subjects/getsubjects")
				.then((response: any) => {
					dispatch(setSubject(response.data.allSubjects));
				})
				.catch((error: any) => {
					console.log(error);
				});
		}
	}, [subjects, dispatch]);

	useEffect(() => {
		if (
			batches?.length > 0 &&
			(!batches[0].subject || batches[0].subject.trim() === "")
		) {
			axios
				.get("/api/batches/getBatches")
				.then((response) => {
					dispatch(setAllBatches(response.data.allBatches));
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [batches, dispatch]);

	return <>{children}</>;
}

export default Main;
