"use client";
import React, { useEffect, useState, useCallback } from "react";
import "./checkbox.css";
import { showToast } from "@/store/slices/Toast";
import { ToastInterface } from "@/store/slices/Toast";
import { AppDispatch } from "@/store/store";
import QueryTable from "../components/QueryTable";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Select from "../components/Select";
import Link from "next/link";
import { filterBatches } from "@/utils/currentBatchFilter";
interface ComponentProps {
	id: string;
}
interface SelectInterface {
	name: string;
	code: string;
}
function Attendance() {
	const [disable, setDisable] = useState(false);
	const [loading, setLoading] = useState(false);
	const [ids, setIds] = useState<string[]>([]);
	const [search, setSearch] = useState<string>("");
	const [values, setValues] = useState<any[]>([]);
	const [searchData, setSearchData] = useState<any[]>([]);
	const [batch, setBatch] = useState<SelectInterface | null>(null);

	const appDispatch: AppDispatch = useDispatch();
	const AllSubjects = useSelector((state: any) => state.Subjects.allSubjects);
	const subjects = AllSubjects.map((subject: any) => ({
		name: subject.subject,
		code: subject._id,
	}));

	const batches = useSelector((state: any) => state.Batches.allBatches);
	useEffect(() => {
		if (!Array.isArray(batches) || batches.length === 0) {
			return;
		}
		const batch = filterBatches(batches);
		
		if (!batch) {
			return;
		}
		setBatch(batch);
		if (subjects && Array.isArray(subjects)) {
			for (let i = 0; i < subjects.length; i++) {
				const element = subjects[i];
				if (element.name === batch.name) {
					setSelectedSubject(element);
					break;
				}
			}
			for (let i = 0; i < batches.length; i++) {
				const element = batches[i];
				if (element._id === batch.code) {
					setBatch({
						name: `${element.days} (${element.time})`,
						code: element._id,
					});
					break;
				}
			}
		}
	}, [batches]);

	const [batchValues, setBatchValues] = useState<SelectInterface[]>([]);

	const [selectedSubject, setSelectedSubject] =
		useState<SelectInterface | null>(null);
	const setSubject = (e: any) => {
		const selectedSubject = e.value;
		setSelectedSubject(selectedSubject);
	};
	const handleCheckboxChange = (event: any) => {
		const { value, checked } = event.target;
		let newVal = [];
		if (checked) {
			newVal = [...ids, value];
		} else {
			newVal = ids.filter((designation) => designation !== value);
		}
		setIds(newVal);
	};

	const show = useCallback(({ summary, detail, type }: ToastInterface) => {
		appDispatch(
			showToast({
				severity: type,
				summary,
				detail,
				visible: true,
			})
		);
	}, []);

	const CheckboxComponent: React.FC<ComponentProps> = ({ id }) => {
		return (
			<div>
				<label className="container" htmlFor={id}>
					<input
						type="checkbox"
						checked={ids.includes(id)}
						onChange={handleCheckboxChange}
						value={id}
						id={id}
					/>
					<svg viewBox="0 0 64 64" height="2.3em" width="2.3em">
						<path
							d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
							pathLength="575.0541381835938"
							className="path"
						></path>
					</svg>
				</label>
			</div>
		);
	};

	const fetchRecords = useCallback(async () => {
		if (!batch) {
			console.log("not fetching");

			return;
		}
		console.log("fetching");
		setLoading(true);

		try {
			const [studentRecords, attendenceRecord] = await Promise.all([
				axios.get(`/api/attendence?id=${batch.code}`),
				axios.get(`/api/attendence/assign-attendence?id=${batch.code}`),
			]);
			setValues(studentRecords.data.data);
			setSearchData(studentRecords.data.data);
			setIds(attendenceRecord.data.data?.studentsId || []);
			setLoading(false);
		} catch (error: any) {
			setLoading(false);

			show({
				summary: "Attendance",
				detail: error.response?.data?.message || "Error fetching attendance!",
				type: "error",
			});
		}
	}, [batch]);

	useEffect(() => {
		fetchRecords();
	}, [batch]);

	useEffect(() => {
		if (!selectedSubject) {
			return;
		}
		const filteredBatches = batches
			.filter((batch: any) => batch.subject === selectedSubject.name)
			.map((batch: any) => ({
				name: `${batch.days} (${batch.time})`,
				code: batch._id,
			}));
		setBatchValues(filteredBatches);
	}, [selectedSubject]);

	const submit = () => {
		if (ids.length === 0) {
			return;
		}
		if (!batch) {
			return;
		}
		const data = { batchId: batch.code, studentsId: ids };
		setDisable(true);
		axios
			.post(`/api/attendence/assign-attendence`, data)
			.then((response) => {
				if (response.data.success) {
					show({
						summary: "Attendance",
						detail: response.data.message,
						type: "success",
					});
				}
			})
			.catch((error) => {
				show({
					summary: "Attendance",
					detail:
						error.response.data.message || "Cann't save attendence record",
					type: "error",
				});
			})
			.finally(() => {
				setDisable(false);
			});
	};

	const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		if (e.target.value.trim() === "") {
			setSearchData(values);
			return;
		}
		const filteredValues = values.filter((item) => {
			const nameField = item.name || ""; // Ensure the field exists
			const regex = new RegExp(e.target.value, "i"); // 'i' for case-insensitive search
			return regex.test(nameField);
		});
		setSearchData(filteredValues);
	};

	const changeBatch = (e: any) => {
		setBatch(e.target.value);
		setSearch("");
	};
	const [nav, setNav] = useState(false);
	const navFunc = (e: MouseEvent) => {
		const container = document.getElementById("filter-container");
		if (
			(e.target as HTMLElement).id !== "show-nav-icon" &&
			!container?.contains(e.target as HTMLElement)
		) {
			setNav(false);
		}
	};
	useEffect(() => {
		document.addEventListener("click", navFunc);

		return () => {
			document.removeEventListener("click", navFunc);
		};
	}, []);

	return (
		<>
			<div className="h-full  sm:rounded-l-[20px] md:rounded-l-[3.2rem] rounded-lg overflow-hidden bg-[#1F2937] z-0">
				<div className="h-full overflow-hidden custom-scrollbar relative z-0 text-sm">
					<header className={`flex w-full items-center justify-between px-5 `}>
						<h2 className="text-2xl font-semibold">Attendence</h2>
						<div className="flex items-center">
							<div className="icon text-right relative">
								<button
									className={`px-3 py-1 text-lg rounded-md bg-[#393E46] ${
										disable ||
										(values.length === 0 &&
											"grayscale-[50%] cursor-not-allowed")
									}`}
									disabled={disable}
									onClick={submit}
								>
									{disable ? (
										<i className="pi pi-spin pi-spinner ml-2"></i>
									) : (
										"Save"
									)}
								</button>
								<i
									className="pi pi-align-right text-2xl cursor-pointer lg:hidden ml-3 z-[100]"
									onClick={() => {
										setNav(true);
									}}
									id="show-nav-icon"
								></i>
							</div>
							<div
								className={`lg:flex flex-col lg:flex-row items-center justify-between  px-4 py-1 absolute lg:relative bg-[#101317] lg:bg-transparent  w-1/2 min-w-72 h-full lg:h-fit right-0 top-0 z-50 lg:w-full transition-all ease-out ${
									nav ? "translate-x-0" : "translate-x-full"
								} lg:translate-x-0 lg:left-0 rounded-l-3xl`}
								id="filter-container"
							>
								<div className="text-right mt-14 lg:mt-0 flex gap-2 flex-col lg:flex-row lg:items-center ">
									<div className="font-normal flex justify-end">
										<div className="flex items-center gap-2 relative w-full lg:w-72 ">
											<input
												type="text"
												value={search}
												onChange={onSearchChange}
												className="w-full px-3 bg-[#393E46] py-2 pr-8 rounded-lg focus:outline outline-[3px] outline-teal-700/70"
												placeholder="Search by name.."
											/>
											<i className="pi pi-search absolute right-2"></i>
										</div>
									</div>

									<Select
										value={selectedSubject}
										handleChange={setSubject}
										options={subjects}
										placeholder="Subjects"
									/>
									<Select
										value={batch}
										handleChange={changeBatch}
										options={batchValues}
										placeholder="Batches"
									/>
								</div>
							</div>
						</div>
					</header>

					<div className="overflow-auto w-full h-full">
						{loading ? (
							<div
								className={`absolute w-full h-[92%] animate-pulse z-10 bg-[#393E46]/70 `}
							></div>
						) : (
							<QueryTable
								columns={[
									{ field: "name", header: "Name" },
									{ field: "subject", header: "Subjects" },
								]}
								values={searchData}
								Components={CheckboxComponent}
							/>
						)}
					</div>
				</div>
				<Link
					href="/all/attendence"
					className="fixed bottom-10 right-8 lg:bottom-20 lg:right-16 bg-lime-700 rounded-full "
				>
					<i className="pi pi-history text-xl lg:text-2xl  px-4 py-3 lg:px-5 lg:py-4"></i>
				</Link>
			</div>
		</>
	);
}

export default Attendance;
