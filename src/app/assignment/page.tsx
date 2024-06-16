"use client";
import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import AddAssignment from "./AddAssignment";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { popAssignment, setAllAssignment } from "@/store/slices/Assignments";
import { AppDispatch } from "@/store/store";
import { showToast } from "@/store/slices/Toast";
import { ToastInterface } from "@/store/slices/Toast";
import Link from "next/link";
import Loading from "../components/Loading";
export interface AddAssignmentInterface {
	title: string;
	explanation: string;
	batch: string;
	subbmissionDate: Date | null | string;
	_id?: string;
	batchId?: string;
	subject?: string;
}
function Assignment() {
	const addDispatch: AppDispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const [details, setdetails] = useState<AddAssignmentInterface>({
		title: "",
		explanation: "",
		batch: "",
		subbmissionDate: null,
	});
	type DeleteFunction = (id: string) => Promise<boolean>;
	const show = ({ summary, detail, type }: ToastInterface) => {
		addDispatch(
			showToast({
				severity: type,
				summary,
				detail,
				visible: true,
			})
		);
	};
	const deleteFunction: DeleteFunction = async (id: string) => {
		try {
			const response = await axios.get(
				`/api/assignment/delete-assignment?id=${id}`
			);
			if (response.data.status) {
				dispatch(popAssignment(id));
				show({
					summary: "Deleted",
					detail: "Successfully deleted",
					type: "info",
				});
			}
			return response.data.status;
		} catch (error: any) {
			show({
				summary: "Error",
				detail: error.response.data.message || error.message,
				type: "error",
			});
			return false;
		}
	};
	const [update, setUpdate] = useState(false);
	const editFunction = (data: AddAssignmentInterface) => {
		setUpdate(true);
		if (data.subbmissionDate && typeof data.subbmissionDate === "string") {
			const [dayStr, monthStr, yearSuffix] = data.subbmissionDate.split("/");

			const day = parseInt(dayStr, 10);
			const month = parseInt(monthStr, 10);
			const year = parseInt(yearSuffix, 10) + 2000; 
			const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
			console.log(data.subbmissionDate)
			console.log(date);

			setdetails({ ...data, subbmissionDate: date });
		}
	};
	const assignments = useSelector(
		(state: any) => state.Assignments.allAssignments
	);
	useEffect(() => {
		if (assignments.length !== 0) {
			setLoading(false);
			return;
		}
		axios
			.get(`/api/assignment`)
			.then((response) => {
				dispatch(setAllAssignment(response.data.data));
			})
			.catch((error) => {
				show({
					summary: "Error",
					detail: error.response.data.message || error.message,
					type: "error",
				});
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<div className="w-full max-h-full flex flex-wrap gap-3 overflow-auto">
			<div className="w-1/2 flex-grow flex-shrink basis-96 lg:max-w-[480px] ">
				<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 hidden"></div>
				<div className="rounded-md md:rounded-lg border border-[#EEEEEE]/60 md:rounded-tl-[2.5rem] rounded-tl-2xl min-h-[50vh] overflow-hidden relative p-3">
					<Loading loading={loading}>
						<h2 className="text-2xl my-1 capitalize font-semibold">
							Add assignments
						</h2>
						<AddAssignment
							details={details}
							setDetails={setdetails}
							update={update}
							setUpdate={setUpdate}
						/>
					</Loading>
				</div>
			</div>

			<div className="w-1/2 flex-grow flex-shrink basis-96 overflow-hidden rounded-md border border-[#EEEEEE]/60 backdrop-blur h-full min-h-36">
				<Loading loading={loading}>
					<div className="w-full h-full relative overflow-auto custom-scrollbar bg-[#1F2937]">
						<div className="flex items-center p-2 justify-between sticky top-0 z-10 bg-[#393E46]">
							<h2 className="text-xl capitalize font-semibold">
								Recent Assignments
							</h2>{" "}
							<Link
								href="/all/show-assignments"
								className="font-light text-emerald-500 text-sm hover:underline hover:opacity-70"
							>
								Vew all
							</Link>
						</div>
						<Table
							columns={[
								{ field: "subject", header: "Subject" },
								{ header: "Batch time", field: "batch" },
								{ header: "Topic", field: "title" },
								{ header: "Submission Date", field: "subbmissionDate" },
							]}
							values={assignments[0]?.batch ? assignments : []}
							deleteFunction={deleteFunction}
							editFunction={editFunction}
						/>
					</div>
				</Loading>
			</div>
		</div>
	);
}

export default Assignment;
