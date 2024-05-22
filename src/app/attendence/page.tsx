"use client";

import React, { useEffect, useState } from "react";
import "./checkbox.css";
import Button from "../components/Button";
import QueryTable from "../components/QueryTable";
import axios from "axios";
import { getNextHour, getPreviousHour } from "@/utils/DateTime";

interface ComponentProps {
	id: string;
}
function page() {
	const [disable, setDisable] = useState(false);
	const [loading, setLoading] = useState(false);
	const [values, setValues] = useState<any[]>([]);
	const [searchData, setSearchData] = useState<any[]>([]);
	const [ids, setIds] = useState<string[]>([]);
	const [time, setTime] = useState<string | undefined>();
	const [day, setDay] = useState<string>();
	const [search, setSearch] = useState<string>("");
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

	const ChekcboxComponent: React.FC<ComponentProps> = ({ id }) => {
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
		const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
		const hour = now.getHours().toString().padStart(2, "0");
		setDay(daysOfWeek[now.getDay()]);
		setTime(hour + ":15");
	}, []);
	useEffect(() => {
		if (!time) {
			return;
		}
		axios
			.get(`/api/attendence?day=${day}&time=${time}`)
			.then((response) => {
				setValues(response.data.users);
				setSearchData(response.data.users);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [time]);
	const submit = () => {
		console.log(ids);
	};
	const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.trim() === "") {
			setSearchData(values);
			return;
		}
		setSearch(e.target.value);
		const filteredValues = values.filter((item) => {
			const nameField = item.name || ""; // Ensure the field exists
			const regex = new RegExp(e.target.value, "i"); // 'i' for case-insensitive search
			return regex.test(nameField);
		});
		setSearchData(filteredValues);
	};
	return (
		<>
			<div className="h-full rounded-l-[3.2rem] overflow-hidden bg-[#1F2937]">
				<div className="h-full overflow-auto custom-scrollbar relative">
					<header className="flex items-center justify-between w-full px-5 py-1">
						<h2 className="text-3xl font-semibold">Attendence</h2>
						<div className=" text-right mt-3 flex gap-2">
							<div className="font-normal flex justify-end">
								<div className="">
									<input
										type="text"
										value={search}
										onChange={onSearchChange}
										className="w-80 px-3 py-2 rounded-lg focus:outline outline-[3px] outline-teal-700/70"
										placeholder="Search by name.."
									/>
								</div>
							</div>
							<button
								className={`px-3 py-1 text-lg rounded-md bg-[#393E46] ${
									disable && "grayscale-[50%] cursor-not-allowed"
								}`}
								disabled={disable}
								onClick={() => {
									if (time) {
										setTime(getPreviousHour(time));
									}
								}}
							>
								<i className="pi pi-chevron-left"></i>
							</button>
							<button
								className={`px-3 py-1 text-lg rounded-md bg-[#393E46] ${
									disable && "grayscale-[50%] cursor-not-allowed"
								}`}
								disabled={disable}
								onClick={() => {
									if (time) {
										setTime(getNextHour(time));
									}
								}}
							>
								<i className="pi pi-chevron-right"></i>
							</button>

							<button
								className={`px-3 py-1 text-lg rounded-md bg-[#393E46] ${
									disable ||
									(values.length === 0 && "grayscale-[50%] cursor-not-allowed")
								}`}
								disabled={disable}
								onClick={submit}
							>
								Save
								{disable && <i className="pi pi-spin pi-spinner ml-2"></i>}
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
							Components={ChekcboxComponent}
						></QueryTable>
					)}
				</div>
			</div>
		</>
	);
}

export default page;
