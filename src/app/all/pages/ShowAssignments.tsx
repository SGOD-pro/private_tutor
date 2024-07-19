import React, { useRef, useState, useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Nullable } from "primereact/ts-helpers";
import SelectCom from "@/app/assignment/SelectCom";
import axios from "axios";
import { AppDispatch } from "@/store/store";
import { showToast, ToastInterface } from "@/store/slices/Toast";
import Loading from "@/app/components/Loading";
import Link from "next/link";
import { AddAssignmentInterface } from "@/app/assignment/page";
import { setAllAssignment, popAssignment } from "@/store/slices/Assignments";
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
	const [values, setvalues] = useState<AddAssignmentInterface[]>([]);
	useEffect(() => {
		
		axios
			.get("/api/assignment")
			.then((response) => {
				setvalues(response.data.data);
				dispatch(setAllAssignment(response.data.data));
			})
			.catch((error) => {
				Tshow({
					type: "error",
					summary: "Error",
					detail: error.response?.data?.message || "An error occurred.",
				});
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const LinkTemplate = ({ data }: { data: AddAssignmentInterface }) => {
		const [loading, setLoading] = useState<boolean>(false);

		const handleDelete = async (id: string) => {
			try {
				setLoading(true);
				await axios.get("/api/assignment/delete?id=" + id);
				dispatch(popAssignment(id));
				setLoading(false);
			} catch (error: any) {
				Tshow({
					type: "error",
					summary: "Error",
					detail: error.response?.data?.message || "An error occurred.",
				});
			}
		};
		return (
			<div className="flex gap-2 items-center justify-center">
				{!data.fileURL ? (
					<Link href={`/assignment/${data._id}`}>
						<i className="pi pi-eye p-3 bg-teal-400 rounded-lg"></i>
					</Link>
				) : (
					<a href={`${data.fileURL}`} target="_blank">
						<i className="pi pi-eye p-3 bg-teal-400 rounded-lg"></i>
					</a>
				)}
				<button
					className="bg-gradient-to-tl to-red-400 from-red-600 rounded-lg p-3 grid place-items-center"
					onClick={() => {
						handleDelete(data._id);
					}}
					disabled={loading}
				>
					{loading ? (
						<i className="pi pi-spin pi-spinner"></i>
					) : (
						<i className="pi pi-trash"></i>
					)}
				</button>
			</div>
		);
	};
	return (
		<div className="w-full h-full">
			<header className="flex justify-between items-stretch border-b border-slate-500/50 pb-2">
				<h1 className="text-2xl font-semibold">
					Assignment Record
				</h1>
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
					<div className="card">
						<DataTable value={assignments || []}>
							<Column field="subject" header="Subject" sortable></Column>
							<Column field="issue" header="Issue" sortable></Column>
							<Column
								field="submissionDate"
								header="Submission"
								sortable
							></Column>
							<Column
								key="action"
								body={(rowData) => <LinkTemplate data={rowData} />}
								header="Actions"
							/>
						</DataTable>
					</div>
				</Loading>
			</main>
		</div>
	);
}

export default ShowAssignments;
