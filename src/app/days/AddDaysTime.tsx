"use client"
import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import "./checkbox.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { pushBatches, updateBatches } from "@/store/slices/Batch";
import { AppDispatch } from "@/store/store";
import { showToast,ToastInterface } from "@/store/slices/Toast";
interface Batch {
	subject: { name: string } | null;
	startTime: Date | null;
	endTime: Date | null;
	days: string[];
}

function AddDaysTime({
	values,
	setValue,
	setUpdate,
	update,
}: {
	values: Batch;
	setValue: React.Dispatch<React.SetStateAction<Batch>>;
	setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
	update: boolean;
}) {
	const [disable, setDisable] = useState(false);
	const dispatch = useDispatch();
	const days = ["Sun", "Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
	const AllSubjects = useSelector((state: any) => state.Subjects.allSubjects);
	const subjects = AllSubjects.map((subject: any) => ({
		name: subject.subject,
	}));
	
	const addDispatch: AppDispatch = useDispatch();
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
	function calcEndTime() {
		if (values.startTime) {
			const newDate = new Date(values.startTime);
			if (
				newDate.getHours() < 22 ||
				(newDate.getHours() === 22 && newDate.getMinutes() < 30)
			) {
				newDate.setMinutes(newDate.getMinutes() + 90);
			}
			return newDate;
		}
		return null;
	}
	const handleCheckboxChange = (event: any) => {
		const { value, checked } = event.target;
		let newVal = [];
		if (checked) {
			newVal = [...values.days, value];
		} else {
			newVal = values.days.filter((designation) => designation !== value);
		}
		setValue((prev) => ({ ...prev, days: newVal }));
	};
	const batches = useSelector((state: any) => state.Batches.allBatches);

	const submit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		let url = "/api/batches/setBatches";

		const _id = localStorage.getItem("batch_id");
		if (update && _id) {
			url = `/api/batches/update-batch?_id=${_id}`;
		}
		setDisable(true);

		axios
			.post(url, values)
			.then((response) => {
				setValue({
					subject: null,
					startTime: null,
					endTime: null,
					days: [],
				});
				console.log(response.data.data);

				show({
						type: "success",
						summary: "Added",
						detail: response.data.message,
					});
				if (update) {
					dispatch(updateBatches(response.data.data));
				} else {
					dispatch(pushBatches(response.data.data));
				}	
			})
			.catch((error) => {
				console.log(error.response.status);
				show({
						type: error.response.status>400?"error":"warn",
						summary: error.response.status>400?"Error":"Warning",
						detail:error.response.data.message||"Internal Server Error",
					});
			})
			.finally(() => {
				setDisable(false);
				localStorage.clear();
				setUpdate(false);
			});
	};
	const [dummy, setDummy] = useState<boolean>(update);
	useEffect(() => {
		if (dummy) {
			return;
		}
		const val = calcEndTime();
		setValue((prev: any) => ({ ...prev, endTime: val }));
	}, [values.startTime]);

	return (
		<form action="" className="" onSubmit={submit}>
			<div className="flex flex-wrap w-full my-3">
				<label htmlFor="caption" className="flex-grow flex-shrink basis-4">
					Subject
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
					<Dropdown
						value={values.subject}
						onChange={(e) => {
							setValue((prev) => ({ ...prev, subject: e.value }));
						}}
						options={subjects}
						optionLabel="name"
						placeholder="Select a Subject"
						className="w-full md:w-14rem text-xs bg-[#393E46]"
					/>
				</div>
			</div>
			<div className="flex flex-wrap w-full my-3">
				<label htmlFor="caption" className="flex-grow flex-shrink basis-4">
					Start Time
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs w-full">
					<Calendar
						value={values.startTime}
						onChange={(e) => {
							setValue((prev: any) => ({ ...prev, startTime: e.value }));

							setDummy(false);
						}}
						timeOnly
						placeholder="<22:30"
						style={{ width: "100%" }}
					/>
				</div>
			</div>
			<div className="flex flex-wrap w-full my-3">
				<label htmlFor="caption" className="flex-grow flex-shrink basis-4">
					End Time
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs w-full">
					<Calendar
						value={values.endTime}
						onChange={(e) =>
							setValue((prev: any) => ({ ...prev, endTime: e.value }))
						}
						timeOnly
						placeholder="24hours format"
						style={{ width: "100%" }}
					/>
				</div>
			</div>
			<div className="grp flex gap-4 items-center w-full mt-3">
				<div className="days flex items-center gap-2 w-full justify-between">
					{days.map((item, index) => (
						<div className="content" key={index}>
							<label className="checkBox relative">
								<input
									name={item.trim()}
									id={item.trim()}
									type="checkbox"
									value={item.trim()}
									checked={values.days.includes(item.trim())}
									onChange={handleCheckboxChange}
								/>
								<label
									htmlFor={item}
									className=" uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold font-mono pointer-events-none bg-transparent z-20 text-[#00ADB5]"
								>
									{item[0]}
								</label>
								<div className="transition z-0"></div>
							</label>
						</div>
					))}
				</div>
			</div>
			<div className=" text-right mt-5">
				{update && (
					<button
						className={`px-3 py-1 text-lg rounded-md bg-gradient-to-l to-red-400 from-red-700 mr-3`}
						disabled={disable}
						onClick={() => {
							setValue({
								subject: null,
								startTime: null,
								endTime: null,
								days: [],
							});
							localStorage.clear();
							setUpdate(false);
						}}
					>
						{disable ? (
							<i className="pi pi-spin pi-spinner ml-1"></i>
						) : (
							<i className="pi pi-times"></i>
						)}
					</button>
				)}
				<button
					className={`px-3 py-1 text-lg rounded-md bg-[#393E46] ${
						update && " bg-gradient-to-l to-emerald-400 from-emerald-700"
					}`}
					disabled={disable}
				>
					{!update ? "Add" : <i className="pi pi-check"></i>}
					{disable && <i className="pi pi-spin pi-spinner ml-1"></i>}
				</button>
			</div>
		</form>
	);
}

export default AddDaysTime;
