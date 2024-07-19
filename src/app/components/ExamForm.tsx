"use client";
import React, { memo, useCallback, useState } from "react";
import InputFields from "./InputFields";
import { Calendar } from "primereact/calendar";
import Select from "./Select";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ToastInterface, showToast } from "@/store/slices/Toast";
import { AppDispatch } from "@/store/store";

interface ExamProps {
	title: string;
	caption: string;
	batch: { name: string; code: string } | null;
	date: Date | null;
}
function ExamForm() {
	const [values, setValues] = useState<ExamProps>({
		title: "",
		caption: "",
		batch: null,
		date: null,
	});
	const addDispatch: AppDispatch = useDispatch();
	const show = useCallback(
		({ summary, detail, type }: ToastInterface) => {
			addDispatch(
				showToast({
					severity: type,
					summary,
					detail,
					visible: true,
				})
			);
		},
	  [],
	)
	
	const AllSubjects = useSelector((state: any) => state.Subjects.allSubjects);
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
		setValues((prev) => ({ ...prev, batch: e.value }));
	};
	const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = { ...values, batch: values.batch?.code };
		setDisable(true);
		axios
			.post(`/api/exam/set-exam`, data)
			.then((response) => {
				console.log(response);
				
				show({
					summary: "Added",
					type: "success",
					detail: response.data.message,
				});
				setSelectedSubject(null)
				setValues({
					title: "",
					caption: "",
					batch: null,
					date: null,
				})
			})
			.catch((err) => {
				show({
					summary: "Added",
					type: "error",
					detail: err.response.data.message || "Internal Error",
				});
			})
			.finally(() => {
				setDisable(false);
			});
	};
	return (
		<form className="w-full h-full overflow-auto" onSubmit={handelSubmit}>
			<InputFields name={"title"} value={values.title} setValue={setValues} />
			<div className="flex flex-wrap w-full my-3">
				<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
					Caption
				</label>
				<textarea
					name="caption"
					id="caption"
					value={values.caption}
					className="flex-grow flex-shrink basis-44 rounded-md p-1 h-20 focus:outline outline-[3px] outline-teal-500/30 transition-all resize-none bg-[#393E46]"
					onChange={(e) => {
						setValues((prev) => ({ ...prev, caption: e.target.value }));
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
						placeholder={"Subject"}
					/>
				</div>
			</div>
			<div className="flex flex-wrap w-full my-3">
				<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
					Batch
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
					<Select
						options={batchValues}
						handleChange={setBatch}
						value={values.batch}
						placeholder={"Batch"}
					/>
				</div>
			</div>
			<div className="flex flex-wrap w-full my-3">
				<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
					Mode
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
					<Select
						options={batchValues}
						handleChange={setBatch}
						value={values.batch}
						placeholder={"Select mode"}
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

export default memo(ExamForm);