import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import "./checkbox.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { pushBatches } from "@/store/slices/Batch";

interface Batch {
	subject: string | null;
	startTime: Date | null;
	endTime: Date | null;
	days: string[];
}

function AddDaysTime() {
	const [values, setValue] = useState<Batch>({
		subject: null,
		startTime: null,
		endTime: null,
		days: [],
	});
	const [update, setUpdate] = useState(false);
	const [disable, setDisable] = useState(false);
	const dispatch = useDispatch();
	const days = ["Sun", "Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
	const AllSubjects = useSelector((state: any) => state.Subjects.allSubjects);
	const subjects = AllSubjects.map((subject: any) => ({
		name: subject.subject,
	}));
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
	const submit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		let url = "/api/batches/setBatches";
		setDisable(true);
		axios
			.post(url, values)
			.then((response) => {
				console.log(response.data);
				setValue({
					subject: null,
					startTime: null,
					endTime: null,
					days: [],
				});
				dispatch(pushBatches(response.data.data));
			})
			.catch((error) => {console.log(error.response.request.status);
			})
			.finally(() => {
				setDisable(false);
			});
	};
	useEffect(() => {
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
						onChange={(e) =>
							setValue((prev) => ({ ...prev, subject: e.value }))
						}
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
						onChange={(e) =>
							setValue((prev: any) => ({ ...prev, startTime: e.value }))
						}
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
									name={item}
									id={item}
									type="checkbox"
									value={item}
									checked={values.days.includes(item)}
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
				<button className="px-3 py-1 text-lg rounded-md bg-[#393E46]">
					Add
					{disable && <i className="pi pi-spin pi-spinner"></i>}
				</button>
			</div>
		</form>
	);
}

export default AddDaysTime;
