import React, { useState, useEffect } from "react";
import Popover from "@/app/components/Popover";
import axios from "axios";
import { AppDispatch } from "@/store/store";
import { showToast, ToastInterface } from "@/store/slices/Toast";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import InputFields from "@/app/components/InputFields";
import QueryTable from "@/app/components/QueryTable";
import Loading from "@/app/components/Loading";

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
	presents: number;
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
	const [showFilter, setShowFilter] = useState(false);
	const filterOptions = (e: any) => {
		if (e.target.id !== "filterOptions") {
			setShowFilter(false);
		}
	};
	useEffect(() => {
		document.addEventListener("click", filterOptions);

		return () => {
			document.removeEventListener("click", filterOptions);
		};
	}, []);

	//First filter Specific date
	const [showF1, setShowF1] = useState(false);
	const [date, setDate] = useState<Nullable<Date>>(null);

	//Second filter between range
	const [showF2, setShowF2] = useState(false);
	const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);

	//Third filter by name and admission no
	const [showF3, setShowF3] = useState(false);

	const [byStudent, setByStudent] = useState({
		admissionNo: "CA-24/25-",
		name: "",
	});
	useEffect(() => {
		setShowF1(false);
		setShowF2(false);
	}, [show]);

	return (
		<>
			<Popover show={show} setShow={setShow}>
				<div className="h-[30vw] min-h-96 w-full overflow-auto custom-scrollbar mt-3 relative rounded-lg">
					<Loading loading={cardLoading}>
						{students.length > 0 ? (
							<div>
								{students.map((student) => (
									<div
										className="flex items-center justify-between gap-3 mb-2 bg-slate-500/30 p-2 px-3 rounded-lg hover:bg-slate-500/60 transition-all"
										key={student._id}
									>
										<div className="flex items-center gap-3">
											<Image
												src={student.picture}
												className="h-16 w-16 rounded-full object-cover"
												alt={student.name[0]}
												width={100}
												height={100}
											/>
											<h3 className="text-xl">{student.name}</h3>
										</div>
										<h2 className="text-lg">69</h2>
									</div>
								))}
							</div>
						) : (
							<h1>No record found</h1>
						)}
					</Loading>
				</div>
			</Popover>
			<Popover show={showF1} setShow={setShowF1}>
				<form action="" className="sm:w-[35vw]">
					<div className="flex-auto">
						<label htmlFor="buttondisplay" className="font-bold block mb-2">
							Button Display
						</label>
						<Calendar
							id="buttondisplay"
							value={date}
							onChange={(e) => setDate(e.value)}
							className="w-full"
						/>
					</div>
					<div className="text-right">
						<button className="rounded-md px-3 py-1 text-lg shadow-md shadow-black active:scale-95 transition-all active:shadow-none to-emerald-400 from-emerald-700 mt-2 bg-gradient-to-r">
							Apply
						</button>
					</div>
				</form>
			</Popover>
			<Popover show={showF2} setShow={setShowF2}>
				<form action="" className="sm:w-[35vw]">
					<div className="card flex justify-content-center flex-auto flex-wrap">
						<label htmlFor="range" className="font-bold block mb-2">
							From - To
						</label>
						<Calendar
							value={dates}
							onChange={(e) => setDates(e.value)}
							selectionMode="range"
							readOnlyInput
							hideOnRangeSelection
							id="range"
							className="w-full"
						/>
					</div>
					<div className="text-right">
						<button className="rounded-md px-3 py-1 text-lg shadow-md shadow-black active:scale-95 transition-all active:shadow-none to-emerald-400 from-emerald-700 mt-2 bg-gradient-to-r">
							Apply
						</button>
					</div>
				</form>
			</Popover>
			<Popover setShow={setShowF3} show={showF3}>
				<header className="w-[50vw] border-b border-b-slate-700">
					<form action="" className="flex gap-5 items-center justify-between">
						<div className="w-[40%]">
							<InputFields
								name={"admissionNo"}
								value={byStudent.admissionNo}
								setValue={setByStudent}
								placeholder={"Search by admission number"}
							></InputFields>
						</div>
						<div className="w-[40%]">
							<InputFields
								name={"name"}
								value={byStudent.name}
								setValue={setByStudent}
								placeholder={"Search by Name"}
							></InputFields>
						</div>
					</form>
				</header>
				<div className="h-[64vh] overflow-auto custom-scrollbar">
					<h2 className="text-center opacity-80">No result found</h2>
					<QueryTable
						columns={[
							{ field: "name", header: "Name" },
							{ field: "admissionNo", header: "Admission no" },
							{ field: "presents", header: "Presents" },
						]}
						values={[]}
					/>
				</div>
			</Popover>
			<header className="flex justify-between items-center relative">
				<h2 className="font-semibold text-3xl">All attendence</h2>
				<i
					className="pi pi-filter text-lg hover:bg-slate-500/60 p-3 px-4 transition-all cursor-pointer rounded-md"
					id="filterOptions"
					onClick={() => {
						setShowFilter((prev) => !prev);
					}}
				></i>
				<div
					className={`${
						showFilter
							? "visible opacity-100 translate-y-full"
							: "invisible opacity-0 translate-y-[90%]"
					} transition-all absolute bottom-0  right-10 flex flex-col bg-slate-900 p-4 rounded-lg`}
				>
					<button
						className="rounded-md bg-slate-600/70 mb-1 px-3 py-1 text-lg font-mono hover:bg-slate-600/90 transition-all"
						onClick={() => {
							setShowF1(true);
							setShowF2(false);
							setShowF3(false);
						}}
					>
						Pin Pont
					</button>
					<button
						className="rounded-md bg-slate-600/70 mb-1 px-3 py-1 text-lg font-mono hover:bg-slate-600/90 transition-all"
						onClick={() => {
							setShowF2(true);
							setShowF1(false);
							setShowF3(false);
						}}
					>
						Time <span className="bg-orange-500 p-1 rounded">Warp</span>
					</button>
					<button
						className="rounded-md bg-slate-600/70 mb-1 px-3 py-1 text-lg font-mono hover:bg-slate-600/90 transition-all"
						onClick={() => {
							setShowF3(true);
							setShowF2(false);
							setShowF1(false);
						}}
					>
						Applicant ID
					</button>
				</div>
			</header>
			<div className="w-full rounded-md h-[calc(100%-3rem)] overflow-auto custom-scrollbar">
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
