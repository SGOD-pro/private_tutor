import React, { useRef, useState, useEffect, useCallback } from "react";
import Popover from "../../components/Popover";
import Table from "../../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Nullable } from "primereact/ts-helpers";
import SelectCom from "@/app/assignment/SelectCom";
import axios from "axios";
import { AppDispatch } from "@/store/store";
import { showToast, ToastInterface } from "@/store/slices/Toast";
import Loading from "@/app/components/Loading";

function ShowAssignments() {
	const dispatch = useDispatch();
	const addDispatch: AppDispatch = useDispatch();
	const Tshow = useCallback(({ summary, detail, type }: ToastInterface) => {
		addDispatch(
			showToast({
				severity: type,
				summary,
				detail,
				visible: true,
			})
		);
	}, []);
	const assignments = useSelector(
		(state: RootState) => state.Assignments.allAssignments
	);
	const [loading, setLoading] = useState<boolean>(false);
	const batchId = useRef<string | null>(null);
	const date = useRef<Nullable<Date>>(new Date());
	useEffect(() => {
		setLoading(true);
		axios
			.get("/api/assignment")
			.then((response) => {})
			.catch((error) => {
				Tshow({
					type: "error",
					summary: "Error",
					detail: error.response?.data?.message || "An error occurred.",
				});
			}).finally(() => {
				setLoading(false);
			});

	}, []);

	return (
		<div className="w-full h-full">
			<header className="flex justify-between items-stretch border-b border-slate-500/50 pb-2">
				<h1 className="text-2xl font-semibold">Assignment Record</h1>
				<nav className="flex gap-2">
					<SelectCom batchId={batchId} subDate={date} />
					<button className="border border-emerald-500 text-emerald-500 hover:bg-slate-300/20 rounded-md">
						<i className="pi pi-search p-3"></i>
					</button>
					<button className="border border-gray-500 text-gray-500 hover:bg-slate-300/20 rounded-md">
						<i className="pi pi-undo p-3"></i>
					</button>
				</nav>
			</header>
			<main className="max-h-full overflow-y-auto custom-scrollbar relative">
				<Loading loading={loading}>
					<Table
						columns={[
							{ header: "Subject", field: "subject" },
							{ header: "Issue", field: "subject" },
							{ header: "Submit", field: "subbmissionDate" },
						]}
						values={[]}
						
					/>
				</Loading>
			</main>
		</div>
	);
}

export default ShowAssignments;
