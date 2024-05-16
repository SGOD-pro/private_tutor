import React, { useState } from "react";
import InputFields from "../components/InputFields";
import Select from "../components/Select";
import { Calendar } from "primereact/calendar";
import axios from "axios";
function AddAssignment() {
	interface AddAssignment {
		title: string;
		explanation: string;
		batch: string;
		subbmissionDate: Date | null;
	}
	const [details, setdetails] = useState<AddAssignment>({
		title: "",
		explanation: "",
		batch: "",
		subbmissionDate: null,
	});
	const [disable, setDisable] = useState(false);
	const submit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (
			details.title.trim() === "" ||
			details.batch.trim() === "" ||
			details.subbmissionDate === null
		) {
			return;
		}
		setDisable(true);
		axios
			.post("/api/assignment/addAssignment", details)
			.then(() => {
				setdetails({
					title: "",
					explanation: "",
					batch: "",
					subbmissionDate: null,
				});
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setDisable(false);
			});
	};
	return (
		<>
			<form className="w-full h-full" onSubmit={submit}>
				<InputFields name="title" value={details.title} setValue={setdetails} />
				<div className="flex flex-wrap w-full my-3">
					<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
						Explanation
					</label>
					<textarea
						name="explanation"
						id="explanation"
						className="flex-grow flex-shrink basis-44 rounded-md p-1 h-20 focus:outline outline-[3px] outline-teal-500/30 transition-all resize-none bg-[#393E46]"
						onChange={(e) => {
							setdetails((prev) => ({ ...prev, explanation: e.target.value }));
						}}
					></textarea>
				</div>
				<div className="flex flex-wrap w-full my-3">
					<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
						Batch
					</label>
					<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
						<Select values={details} setValues={setdetails} />
					</div>
				</div>

				<div className="flex flex-wrap w-full my-3">
					<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
						Subbmission Date
					</label>
					<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
						<Calendar
							value={details.subbmissionDate}
							onChange={(e: any) =>
								setdetails((prev) => ({ ...prev, subbmissionDate: e.value }))
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
		</>
	);
}

export default AddAssignment;
