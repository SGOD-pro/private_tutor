"use client";
import React, { useState } from "react";
import InputFields from "./InputFields";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
interface ExamProps {
	title: string;
	caption: string;
	batch: string;
	date: Date | null;
}
function ExamForm() {
	const [values, setValues] = useState<ExamProps>({
		title: "",
		caption: "",
		batch: "",
		date: null,
	});
	const cities = [
		{ name: "New York" },
		{ name: "Rome" },
		{ name: "London" },
		{ name: "Istanbul" },
		{ name: "Paris" },
	];
	const [disable, setDisable] = useState(false);
	const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(values);
	};
	return (
		<form className="w-full h-full" onSubmit={handelSubmit}>
			<InputFields name={"title"} value={values.title} setValue={setValues} />
			<div className="flex flex-wrap w-full my-3">
				<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
					Caption
				</label>
				<textarea
					name="caption"
					id="caption"
					className="flex-grow flex-shrink basis-44 rounded-md p-1 h-20 focus:outline outline-[3px] outline-teal-500/30 transition-all resize-none bg-[#393E46]"
				></textarea>
			</div>
			<div className="flex flex-wrap w-full my-3">
				<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
					Batch
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
					<Dropdown
						value={values.batch}
						onChange={(e) => setValues((prev) => ({ ...prev, batch: e.value }))}
						options={cities}
						optionLabel="name"
						placeholder="Select a City"
						className="w-full md:w-14rem text-xs bg-[#393E46]"
					/>
				</div>
			</div>
			<div className="flex flex-wrap w-full my-3">
				<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
					Date
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
					<Calendar
						value={values.date}
						onChange={(e: any) =>
							setValues((prev) => ({ ...prev, date: e.value }))
						}
						style={{ width: "100%" }}
						dateFormat="dd/mm/yy"
					/>
				</div>
			</div>
			<div className=" text-right">
				<button
					className="px-3 py-1 text-lg rounded-md bg-[#393E46]"
					disabled={disable}
				>
					Add
					{disable && <i className="pi pi-spin pi-spinner"></i>}
				</button>
			</div>
		</form>
	);
}

export default ExamForm;
