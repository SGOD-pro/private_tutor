"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import Link from "next/link";

interface BatchesInterface {
	batchName: string;
	batchId: string;
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
	const uniqueColors = [
		"#FF5733",
		"#33FF57",
		"#5733FF",
		"#FF33B2",
		"#B2FF33",
		"#33B2FF",
		"#FF3333",
		"#33FFB2",
		"#B233FF",
		"#33FF33",
	];
	const Tshow = useCallback(
		({ summary, detail, type }: ToastInterface) => {
			appDispatch(
				showToast({
					severity: type,
					summary,
					detail,
					visible: true,
				})
			);
		},
		[appDispatch]
	);

	//First filter Specific date
	const [date, setDate] = useState<Nullable<Date>>(null);

	//Second filter between range
	const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);

	const [oldData, setOldData] = useState<ShowAttendenceInterface[]>([]);
	const filterByDate = useCallback(() => {
		{
			let url = `/api/attendence/get-all-attendence`;
			if (date) {
				url = `/api/attendence/get-all-attendence?startDate=${date}`;
				if (oldData.length == 0) {
					setOldData(data);
				}
			} else if (dates) {
				url = `/api/attendence/get-all-attendence?startDate=${dates[0]}&endDate=${dates[1]}`;
				if (oldData.length == 0) {
					setOldData(data);
				}
			} else if (data.length > 0) {
				setData(oldData);
				setOldData([]);
				return;
			}
			setShowF3(false);
			setLoading(true);
			axios
				.get(url)
				.then((response) => {
					setData(response.data.data);
					setDate(null);
					setDates(null);
				})
				.catch((error) => {
					Tshow({
						summary: "Cannot fetch",
						detail: error.response.data.message || error.message,
						type: "error",
					});
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [date, dates]);
	useEffect(() => {
		filterByDate();
	}, []);

	const [students, setStudents] = useState<Studnets[]>([]);
	const [cardLoading, setCardLoading] = useState(true);
	const showStudents = ({ id, batchId }: { id: string; batchId: string }) => {
		if (!id || id.trim() === "" || !batchId || batchId.trim() === "") {
			return;
		}
		setCardLoading(true);
		axios
			.get(`/api/attendence/get-students-record?id=${id}&batch=${batchId}`)
			.then((response) => {
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

	//Third filter by name and admission no
	const [showF3, setShowF3] = useState(false);
	const [byStudent, setByStudent] = useState({
		admissionNo: "CA-24/25-",
		name: "",
	});
	const [byStudentData, setbyStudentData] = useState([]);
	const filterByStudent = useCallback(() => {
		const pattern = new RegExp("^CA-\\d{2}/\\d{2}-\\d+$");
		const isMatch = pattern.test(byStudent.admissionNo);
		console.log(isMatch, byStudent);

		if (byStudent.name.trim() === "" && !isMatch) {
			return;
		}
		let url;
		if (isMatch) {
			console.log(byStudent.admissionNo);
			url = `/api/attendence/filter-by-applicant?name=${byStudent.name.trim()}&adno=${
				byStudent.admissionNo
			}`;
		} else {
			url = `/api/attendence/filter-by-applicant?name=${byStudent.name.trim()}&adno=""`;
		}
		axios
			.get(url)
			.then((response) => {
				setbyStudentData(response.data.data);
			})
			.catch((error) => {
				Tshow({
					summary: "Cannot fetch",
					detail: error.response.data.message || error.message,
					type: "error",
				});
			});
	}, [byStudent]);

	useEffect(() => {
		setByStudent({
			admissionNo: "CA-24/25-",
			name: "",
		});
		setbyStudentData([]);
	}, [showF3]);

	return (
		<>
			<Popover show={show} setShow={setShow}>
				<div className="h-[30vw] min-h-96 w-full overflow-auto custom-scrollbar mt-3 relative rounded-lg">
					<Loading loading={cardLoading}>
						{students.length > 0 ? (
							<div>
								{students.map((student) => (
									<Link
										className="flex items-center justify-between gap-3 mb-2 bg-slate-500/30 p-2 px-3 rounded-lg hover:bg-slate-500/60 transition-all"
										key={student._id}
										id={student._id}
										href={`student-attendence/${student._id}`}
									>
										<div className="flex items-center gap-3">
											<div
												className={`h-16 w-16 rounded-full relative overflow-hidden`}
												style={{
													backgroundColor:
														uniqueColors[Math.floor(Math.random() * 10)],
												}}
											>
												{!student.picture || student.picture.trim() === "" ? (
													<h3 className="text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
														{student.name[0]}
													</h3>
												) : (
													<Image
														src={student.picture}
														className="w-full h-full object-cover"
														alt={student.name[0]}
														width={100}
														height={100}
													/>
												)}
											</div>
											<h3 className="text-xl">{student.name}</h3>
										</div>
										<h2 className="text-lg">{student.presents}</h2>
									</Link>
								))}
							</div>
						) : (
							<h1>No record found</h1>
						)}
					</Loading>
				</div>
			</Popover>

			<Popover setShow={setShowF3} show={showF3}>
				<header className="w-[50vw] border-b border-b-slate-700">
					<form
						action=""
						className="flex gap-4 items-end justify-between"
						onSubmit={(e: React.FormEvent) => {
							e.preventDefault();
							filterByStudent();
						}}
					>
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
						<button
							className="rounded-md transition-all border border-[#F6961D]/70 text-[#F6961D]  mb-2 active:scale-95 hover:bg-[#F6961D] hover:text-white"
							id=""
						>
							<span className="pi pi-search p-3"></span>
						</button>
					</form>
				</header>
				<div className="h-[64vh] overflow-auto custom-scrollbar relative">
					<Loading loading={false}>
						<h2 className="text-center opacity-80">No result found</h2>
						<QueryTable
							columns={[
								{ field: "name", header: "Name" },
								{ field: "admissionNo", header: "Admission no" },
								{ field: "presentByBatch", header: "Presents" },
							]}
							values={byStudentData}
						/>
					</Loading>
				</div>
			</Popover>
			<header className="flex justify-between items-start relative px-4 py-1 md:px-1 md:py-1 border-b">
				<h2 className="font-semibold text-xl sm:text-3xl ">All attendence</h2>
				<i
					className="pi md:hidden block pi-filter text-lg hover:bg-slate-500/60 p-3 px-4 transition-all cursor-pointer rounded-md"
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
					} transition-all absolute bottom-0 right-10 xl:right-10 sm:right-0 flex flex-col md:flex-row lg:gap-6 md:gap-3 bg-slate-900 md:bg-transparent p-4 md:p-0 rounded-lg md:visible md:opacity-100 md:translate-y-0 md:relative items-center z-50`}
				>
					<i
						className={`${
							date || dates ? "block" : "hidden"
						} pi pi-filter-slash p-2 w-full mb-1 sm:w-fit sm:mb-0 text-center  bg-orange-500/70 rounded-md cursor-pointer hover:bg-orange-500/90 transition-all`}
						onClick={() => {
							setDate(null);
							setDates(null);
						}}
					></i>
					<div className="flex-auto">
						<Calendar
							id="buttondisplay"
							value={date}
							onChange={(e) => {
								setDate(e.value);
								filterByDate();
							}}
							className="w-full"
							placeholder="Select yout specific date"
						/>
					</div>

					<div className="card flex justify-content-center flex-auto flex-wrap">
						<Calendar
							value={dates}
							onChange={(e) => {
								setDates(e.value);
								filterByDate();
							}}
							selectionMode="range"
							readOnlyInput
							hideOnRangeSelection
							id="range"
							className="w-full"
							placeholder="Select the range"
						/>
					</div>
					<button
						className="rounded-md w-full md:max-w-fit bg-slate-600/70 mb-1 px-3 py-1 text-lg font-mono hover:bg-slate-600/90 transition-all"
						onClick={() => {
							setShowF3(true);
						}}
					>
						Applicant ID
					</button>
				</div>
			</header>
			<div className="w-full rounded-md h-[calc(100%-3rem)] overflow-auto custom-scrollbar relative mt-1">
				<Loading loading={loading}>
					<div className="">
						{data.map((item: ShowAttendenceInterface, index: number) => (
							<>
								<h2 className="mt-3 text-3xl font-semibold font-mono">
									{item.date}
								</h2>
								{item.batches.map((batch: BatchesInterface) => (
									<div className="col-12 w-full" key={index}>
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
															showStudents({
																id: batch.originalId,
																batchId: batch.batchId,
															});
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
				</Loading>
			</div>
		</>
	);
}

export default AllAttendence;
