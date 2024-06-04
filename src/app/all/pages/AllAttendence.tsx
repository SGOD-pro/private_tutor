import React, { useState, useEffect } from "react";
import Popover from "@/app/components/Popover";
import axios from "axios";
import { AppDispatch } from "@/store/store";
import { showToast, ToastInterface } from "@/store/slices/Toast";
import { useDispatch } from "react-redux";
import Image from "next/image";

interface BatchesInterface {
	batchName: string;
	batchid: string;
	noOfPresents: string;
	originalId: string;
}
interface ShowAttendenceInterface {
	date: string;
	_id: string;
	batches: BatchesInterface[];
}
interface Studnets {
	_id: string;
	name: string;
	picture: string;
}
function AllAttendence() {
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<ShowAttendenceInterface[]>([]);
	const appDispatch: AppDispatch = useDispatch();

	const Tshow = ({ summary, detail, type }: ToastInterface) => {
		appDispatch(
			showToast({
				severity: type,
				summary,
				detail,
				visible: true,
			})
		);
	};
	useEffect(() => {
		setLoading(true);
		axios
			.get(`/api/attendence/get-all-attendence`)
			.then((response) => {
				setData(response.data.data);
				console.log(response.data.data);
			})
			.catch((error) => {
				Tshow({
					summary: "Cannot fetch",
					detail: error.response.data.message || error.message,
					type: "error",
				});
			});
	}, []);
	const [students, setStudents] = useState<Studnets[]>([]);
	const [cardLoading, setCardLoading] = useState(true);
	const showStudents = (id: string) => {
		if (!id || id.trim() === "") {
			return;
		}
		setCardLoading(true);
		axios
			.get(`/api/attendence/get-students-record?id=${id}`)
			.then((response) => {
				console.log(response.data.data.students);
				setStudents(response.data.data.students);
			})
			.catch((error) => {
				Tshow({
					summary: "Cannot fetch",
					detail: error.response.data.message || error.message,
					type: "error",
				});
			})
			.finally(() => {
				setCardLoading(false);
			});
	};
	return (
		<>
			<Popover show={show} setShow={setShow}>
				<div className="h-[30vw] min-h-96 w-full overflow-auto custom-scrollbar mt-3">
					{students.length > 0 ? (
						<div>
							{students.map((student) => (
								<div
									className="flex items-center gap-3 mb-2 bg-slate-500/30 p-2 px-3 rounded-lg hover:bg-slate-500/60 transition-all"
									key={student._id}
								>
									<Image
										src={student.picture}
										className="h-16 w-16 rounded-full object-cover"
										alt={student.name[0]}
										width={100}
										height={100}
									/>
									<h3 className="text-xl">{student.name}</h3>
								</div>
							))}
						</div>
					) : (
						<h1>No record found</h1>
					)}
				</div>
			</Popover>
			<div className="w-full rounded-md h-full overflow-auto custom-scrollbar">
				<div className="">
					{data.map((item: ShowAttendenceInterface, index: number) => (
						<>
							<h2 className="mt-3 text-3xl font-semibold font-mono">
								{item.date}
							</h2>
							{item.batches.map((batch: BatchesInterface) => (
								<div className="col-12 w-full" key={batch.batchName.length}>
									<div className="flex flex-column xl:flex-row xl:items-start p-2 gap-2 border-t-1 surface-border">
										<div className="flex flex-column sm:flex-row justify-content-between  items-center flex-1 gap-1 justify-between border border-slate-400/50 p-2 px-4 rounded-md">
											<div className="flex flex-column  items-center sm:items-start">
												<div className="text-xl font-bold text-900">
													{batch.batchName}
												</div>
											</div>
											<div className="flex sm:flex-column items-center gap-3 sm:gap-2">
												<span className="text-2xl font-semibold">
													{batch.noOfPresents}
												</span>
												<button
													className="rounded-full bg-gradient-to-tl shadow-md active:scale-95 transition-all active:shadow-none to-emerald-400 from-emerald-700 grid place-items-center p-2"
													onClick={() => {
														setShow(true);
														showStudents(batch.originalId);
													}}
												>
													<i className="pi pi-eye px-1  text-2xl"></i>
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
						</>
					))}
				</div>
			</div>
		</>
	);
}

export default AllAttendence;
