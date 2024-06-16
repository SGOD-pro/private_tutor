import React, { useState, useEffect, memo } from "react";
import InputFields from "../components/InputFields";
import Select from "../components/Select";
import { Calendar } from "primereact/calendar";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { pushAssignment } from "@/store/slices/Assignments";
import { extractDate } from "@/utils/DateTime";
import { AddAssignmentInterface } from "./page";

function AddAssignment({
	details,
	setDetails,
	update,
	setUpdate,
}: {
	details: AddAssignmentInterface;
	setDetails: React.Dispatch<React.SetStateAction<AddAssignmentInterface>>;
	update: boolean;
	setUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const dispatch = useDispatch();
	const AllSubjects = useSelector((state: any) => state.Subjects.allSubjects);
	interface BatchInterface {
		code: string;
		name: string;
	}
	const subjects: BatchInterface[] = AllSubjects.map((subject: any) => ({
		name: subject.subject,
		code: subject._id,
	}));

	const batches = useSelector((state: any) => state.Batches.allBatches);

	const [batchValues, setBatchValues] = useState<BatchInterface[]>([]);

	const [disable, setDisable] = useState(false);
	const [date, setDate] = useState<Date | null>(null);
	const [selectedSubject, setSelectedSubject] = useState<any>(null);

	const [batch, setBatch] = useState<BatchInterface | null>(null);
	const SetBatch = (e: any) => {
		setBatch(e.value);
	};
const reset=()=>{
	setDetails({
		title: "",
		explanation: "",
		batch: "",
		subbmissionDate: "",
	});
	setSelectedSubject(null);
	setBatchValues([]);
	setBatch(null);
	setDate(null);
}
	const submit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (details.title.trim() === "" || details.subbmissionDate === null) {
			return;
		}
		if (!batch?.code) {
			return;
		}
		const data = { ...details, batch: batch.code,subbmissionDate:date };
		console.log(data);
		setDisable(true);

		//TODO: update the route for update the submissions
		axios
			.post("/api/assignment", data)
			.then((response) => {
				const responseData: any = {
					title: details.title,
					subject: selectedSubject.name,
					batch: batch?.name || "",
					subbmissionDate: extractDate(`${details.subbmissionDate}`),
					_id: response.data.data._id,
				};
				reset()
				dispatch(pushAssignment(responseData));
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setDisable(false);
			});
	};
	useEffect(() => {
		if (selectedSubject?.name) {
			const filteredBatches = batches
				.filter((batch: any) => batch.subject === selectedSubject.name)
				.map((batch: any) => ({
					name: `${batch.days} (${batch.time})`,
					code: batch._id,
				}));
			setBatchValues(filteredBatches);
		}
	}, [selectedSubject]);
	useEffect(() => {
		batchValues.forEach((element) => {
			if (element.code === details.batchId) {
				setBatch(element);
				console.log(element);
			}
		});
	}, [batchValues, selectedSubject]);
	useEffect(() => {
		if (update) {
			console.log(batchValues);
			subjects.forEach((subject) => {
				if (subject.name === details.subject) {
					setSelectedSubject(subject);
					console.log(subject);
				}
			});
			if (details.subbmissionDate instanceof Date) {
				setDate(details.subbmissionDate);
				console.log(details.subbmissionDate);
			}
		}
	}, [details]);

	return (
		<>
			<form className="w-full h-full" onSubmit={submit}>
				<InputFields name="title" value={details.title} setValue={setDetails} />
				<div className="flex flex-wrap w-full my-3">
					<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
						Explanation
					</label>
					<textarea
						name="explanation"
						id="explanation"
						className="flex-grow flex-shrink basis-44 rounded-md p-1 h-20 focus:outline outline-[3px] outline-teal-500/30 transition-all resize-none bg-[#393E46]"
						value={details.explanation}
						onChange={(e) => {
							setDetails((prev) => ({ ...prev, explanation: e.target.value }));
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
							handleChange={(e: any) => setSelectedSubject(e.value)}
							value={selectedSubject}
							placeholder="Subject"
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
							handleChange={SetBatch}
							value={batch}
							placeholder="Select Batch"
						/>
					</div>
				</div>

				<div className="flex flex-wrap w-full my-3">
					<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
						Subbmission Date
					</label>
					<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
						<Calendar
							value={date}
							onChange={(e: any) => setDate(e.value)}
							style={{ width: "100%" }}
							dateFormat="dd/mm/yy"
						/>
					</div>
				</div>
				<div className={`text-right `}>
				{update && setUpdate && (
					<button
						className={`px-3 py-1 text-lg rounded-md active:scale-90 transition-all shadow-md shadow-black active:shadow-none bg-gradient-to-l to-red-400 from-red-700 mr-3`}
						disabled={disable}
						onClick={() => {
							reset()
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
					className={`px-3 py-1 text-lg rounded-md bg-[#393E46] active:scale-90 transition-all shadow-md shadow-black active:shadow-none ${
						update && "bg-gradient-to-l to-emerald-400 from-emerald-700"
					}`}
					disabled={disable}
				>
					{!update ? "Add" : <i className="pi pi-check"></i>}
					{disable && <i className="pi pi-spin pi-spinner ml-1"></i>}
				</button>
			</div>
			</form>
		</>
	);
}

export default memo(AddAssignment);
