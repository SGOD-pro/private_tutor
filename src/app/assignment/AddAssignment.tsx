import React, { useState } from "react";
import InputFields from "../components/InputFields";
import Select from "../components/Select";
import { Calendar } from "primereact/calendar";
import axios from "axios";
import { useSelector } from "react-redux";
useSelector;
function AddAssignment() {
	interface AddAssignment {
		title: string;
		explanation: string;
		batch: { name: string; code: string } | null;
		subbmissionDate: Date | null;
	}
	const [details, setdetails] = useState<AddAssignment>({
		title: "",
		explanation: "",
		batch: null,
		subbmissionDate: null,
	});
	const AllSubjects = useSelector((state: any) => state.Subjects.allSubjects);
	console.log(AllSubjects);

	const subjects = AllSubjects.map((subject: any) => ({
		name: subject.subject,
		code: subject._id,
	}));

	const batches = useSelector((state: any) => state.Batches.allBatches);

	const [batchValues, setBatchValues] = useState([]);

	const [disable, setDisable] = useState(false);

	const [selectedSubject, setSelectedSubject] = useState(null);
	const setSubject = (e: any) => {
		const selectedSubject = e.value;
		setSelectedSubject(selectedSubject);
		const filteredBatches = batches
			.filter((batch: any) => batch.subject === selectedSubject.name)
			.map((batch: any) => ({
				name: `${batch.days} (${batch.time})`,
				code: batch._id,
			}));
		setBatchValues(filteredBatches);
	};
	const setBatch = (e: any) => {
		console.log(e.value);
		setdetails((prev) => ({ ...prev, batch: e.value }));
	};
	const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = { ...details, batch: details.batch?.code };
		console.log(data);
	};
	const submit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (
			details.title.trim() === "" ||
			!details.batch ||
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
					batch: null,
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
					Subject
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
					<Select
						options={subjects}
						handleChange={setSubject}
						value={selectedSubject}
					/>
				</div>
			</div>
			<div className="flex flex-wrap w-full my-3">
				<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
					Date & Time
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
					<Select
						options={batchValues}
						handleChange={setBatch}
						value={details.batch}
					/>
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
