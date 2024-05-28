"use client";

import React, { useEffect, useState } from "react";
import "./checkbox.css";
import { showToast } from "@/store/slices/Toast";
import { ToastInterface } from "@/store/slices/Toast";
import { AppDispatch } from "@/store/store";
import QueryTable from "../components/QueryTable";
import axios from "axios";
import { useDispatch } from "react-redux";
import Select from "../components/Select";

interface ComponentProps {
	id: string;
}

function Page() {
	const [disable, setDisable] = useState(false);
	const [loading, setLoading] = useState(true);
	const [ids, setIds] = useState<string[]>([]);
	const [day, setDay] = useState<string | null>(null);
	const [search, setSearch] = useState<string>("");
	const [allBatches, setAllBatches] = useState<any[]>([]);
	const [values, setValues] = useState<any[]>([]);
	const [searchData, setSearchData] = useState<any[]>([]);
	const [batch, setBatch] = useState<any>(null);

	const appDispatch: AppDispatch = useDispatch();

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

	const show = ({ summary, detail, type }: ToastInterface) => {
		appDispatch(
			showToast({
				severity: type,
				summary,
				detail,
				visible: true,
			})
		);
	};

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
							className="path transition-all duration-300"
						></path>
					</svg>
				</label>
			</div>
		);
	};

	useEffect(() => {
		const now = new Date();
		const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		let currentDay = daysOfWeek[now.getDay()];
		setDay(currentDay);

		axios
			.get(`/api/batches/today-batches?day=${currentDay}`)
			.then((response) => {
				console.log(response.data.data);
				setAllBatches(response.data.data);
				if (response.data.data.length === 0) {
					setDisable(true);
				}
			})
			.catch((error) => {
				console.log(error);
				show({
					summary: "Attendance",
					detail: error.response?.data?.message || "Error fetching batches",
					type: "error",
				});
			});
	}, []);

	useEffect(() => {
		if (!day) {
			return;
		}

		axios
			.get(`/api/attendence/get-batch?day=${day}`)
			.then((response) => {
				const cbatch = allBatches.find(
					(batch) => batch.code === response.data.data?._id
				);
				console.log(cbatch);
				setBatch(cbatch);
			})
			.catch((error) => {
				console.log(error);
				show({
					summary: "Attendance",
					detail: error.response?.data?.message || "Error fetching batch",
					type: "error",
				});
			});
	}, [allBatches, day]);

	useEffect(() => {
		if (!batch) {
			return;
		}
		console.log(batch.code);
		setLoading(true);
		axios
			.get(`/api/attendence?id=${batch.code}`)
			.then((response) => {
				console.log(response.data.data);
				setValues(response.data.data);
				setSearchData(response.data.data);
			})
			.catch((error) => {
				console.log(error);
				show({
					summary: "Attendance",
					detail: error.response?.data?.message || "Error fetching attendance!",
					type: "error",
				});
			})
			.finally(() => {
				setLoading(false);
			});
		axios
			.get(`/api/attendence/assign-attendence?id=${batch.code}`)
			.then((response) => {
				console.log(response.data.data);

				setIds(response.data.data?.studentsId || []);
				show({
					summary: "Attendance",
					detail: response.data.message,
					type: "success",
				});
			})
			.catch((error) => {
				console.log(error);
				show({
					summary: "Attendance",
					detail: error.response?.data?.message || "Error fetching record!",
					type: "error",
				});
			});
	}, [batch]);

	const submit = () => {
		console.log(ids);
		if (ids.length === 0) {
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
		console.log(e.target.value);
		setBatch(e.target.value);
		setSearch("");
	};

	return (
		<>
			<div className="h-full rounded-l-[3.2rem] overflow-hidden bg-[#1F2937]">
				<div className="h-full overflow-auto custom-scrollbar relative">
					<header className="flex items-center justify-between w-full px-5 py-1">
						<h2 className="text-3xl font-semibold">Attendance</h2>
						<div className="text-right mt-3 flex gap-2 items-center">
							<div className="font-normal flex justify-end">
								<div className="flex items-center gap-2 relative">
									<input
										type="text"
										value={search}
										onChange={onSearchChange}
										className="w-80 px-3 py-2 pr-8 rounded-lg focus:outline outline-[3px] outline-teal-700/70"
										placeholder="Search by name.."
									/>
									<i className="pi pi-search absolute right-2"></i>
								</div>
							</div>

							<Select
								value={batch}
								handleChange={changeBatch}
								options={allBatches}
								placeholder="Batch"
							/>

							<button
								className={`px-3 py-1 text-lg rounded-md bg-[#393E46] ${
									disable ||
									(values.length === 0 && "grayscale-[50%] cursor-not-allowed")
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
						</div>
					</header>
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
		</>
	);
}

export default Page;
