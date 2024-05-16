"use client";
import React, { useEffect, useState } from "react";
import AddSubject from "../components/AddSubject";
import AddDaysTime from "./AddDaysTime";
import Table from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { setSubject,popSubject } from "@/store/slices/Subjects";
import { popBatches, setAllBatches } from "@/store/slices/Batch";
import { AppDispatch } from "@/store/store";
import { showToast } from "@/store/slices/Toast";
import axios from "axios";

function page() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const columns = [
		{ field: "subject", header: "Subject" },
		{ field: "time", header: "Time" },
		{ field: "days", header: "Days" },
	];
	const addDispatch: AppDispatch = useDispatch();
	interface toast {
		summary: string;
		detail: string;
		type: string;
	}
	const show = ({ summary, detail, type }: toast) => {
		addDispatch(
			showToast({
				severity: type,
				summary,
				detail,
				visible: true,
			})
		);
	};
	type DeleteFunction = (id: string) => Promise<boolean>;

	const deleteFunction: DeleteFunction = async (id: string) => {
		try {
			console.log(id);

			const response = await axios.get(`/api/batches/deleteBatch?id=${id}`);
			if (response.data.status) {
				
				dispatch(popBatches(id))
				show({summary:"Deleted",detail:"Successfully deleted","type":"info"})
			}
			return response.data.status;
		} catch (error) {
			console.error("Error occurred while deleting:", error);
			return false;
		}
	};
	const editFunction = (id: string) => {
		console.log(id);
	};
	const batches = useSelector((state: any) => state.Batches.allBatches);
	const subjects = useSelector((state: any) => state.Subjects.allSubjects);
	useEffect(() => {
		if (!batches[0].subject || batches[0].subject.trim() === "") {
			console.log("exceeded");
			axios
				.get("/api/batches/getBatches")
				.then((response) => {
					console.log(response.data);
					dispatch(setAllBatches(response.data.allBatches));
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {});
		}
	}, []);
	useEffect(() => {
		if (!subjects[0].subject || subjects[0].subject.trim() === "") {
			console.log("exceeded");

			axios
				.get("/api/subjects/getsubjects")
				.then((response) => {
					dispatch(setSubject(response.data.allSubjects));
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}, []);
	return (
		<div className="w-full h-full flex flex-wrap gap-3">
			<div className="w-1/2 flex-grow flex-shrink basis-96 lg:max-w-[480px] ">
				<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 hidden"></div>
				<div className="rounded-md md:rounded-lg border border-[#EEEEEE]/60 md:rounded-tl-[2.5rem] rounded-tl-2xl  overflow-hidden relative p-3">
					<div
						className={`absolute top-0 left-0 w-full h-full animate-pulse z-10 bg-[#393E46]/70 ${
							loading ? "block" : "hidden"
						}`}
					></div>

					<div
						className={`w-full h-full p-1 ${
							loading ? "opacity-0" : "opacity-100"
						}`}
					>
						<h2 className="text-2xl my-1 capitalize font-semibold">
							New Subject
						</h2>
						<AddSubject />
					</div>
				</div>

				<div className="rounded-md md:rounded-lg border border-[#EEEEEE]/60 my-2 md:my-4  overflow-hidden relative p-3">
					<div
						className={`absolute top-0 left-0 w-full h-full animate-pulse z-10 bg-[#393E46]/70 ${
							loading ? "block" : "hidden"
						}`}
					></div>

					<div
						className={`w-full h-full p-1 ${
							loading ? "opacity-0" : "opacity-100"
						}`}
					>
						<h2 className="text-2xl my-1 capitalize font-semibold">
							Set Days & Time
						</h2>
						<AddDaysTime />
					</div>
				</div>
			</div>

			<div className="w-1/2 flex-grow flex-shrink basis-96 overflow-hidden rounded-md border border-[#EEEEEE]/60 backdrop-blur h-full">
				{loading ? (
					<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 "></div>
				) : (
					<div className="w-full h-full relative overflow-auto custom-scrollbar bg-[#1F2937]">
						<h2 className="text-xl capitalize p-2 font-semibold sticky top-0 z-10 bg-[#393E46]">
							all batches
						</h2>
						<Table
							columns={columns}
							values={batches}
							deleteFunction={deleteFunction}
							editFunction={editFunction}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default page;
