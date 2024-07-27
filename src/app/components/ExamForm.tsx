"use client";
import React, { memo, useCallback, useState } from "react";
import InputFields from "./InputFields";
import { Calendar } from "primereact/calendar";
import Select from "./Select";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ToastInterface, showToast } from "@/store/slices/Toast";
import { AppDispatch } from "@/store/store";
import {
	InputNumber,
	InputNumberValueChangeEvent,
} from "primereact/inputnumber";

interface ExamProps {
	title: string;
	caption: string;
	batch: { name: string; code: string } | null;
	date: Date | null;
	mode?: boolean;
	fullMarks: number | null;
}
function ExamForm() {
	const [values, setValues] = useState<ExamProps>({
		title: "",
		caption: "",
		batch: null,
		date: null,
		mode: true,
		fullMarks: 0,
	});
	const reset = useCallback(() => {
		setValues({
			title: "",
			caption: "",
			batch: null,
			date: null,
			mode: true,
			fullMarks: 0,
		});
		setSelectedSubject(null);
		setMode(null);
	}, []);
	const [mode, setMode] = useState<{ code: boolean; name: string }|null>();

	const addDispatch: AppDispatch = useDispatch();
	const show = useCallback(({ summary, detail, type }: ToastInterface) => {
		addDispatch(
			showToast({
				severity: type,
				summary,
				detail,
				visible: true,
			})
		);
	}, []);

	const AllSubjects = useSelector((state: any) => state.Subjects.allSubjects);
	const subjects = AllSubjects.map((subject: any) => ({
		name: subject.subject,
		code: subject._id,
	}));

	const batches = useSelector((state: any) => state.Batches.allBatches);

	const [batchValues, setBatchValues] = useState([]);
	const [modeValues, setModeValues] = useState([
		{ name: "Online", code: true },
		{ name: "Offline", code: false },
	]);
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
		setValues((prev) => ({ ...prev!, batch: e.value }));
	};
	const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = { ...values, batch: values?.batch?.code };
		if (!mode) {
			show({
				summary: "WARNING",
				type: "warn",
				detail: "Please add mode",
			});
			return;
		}
		data.mode = mode.code;
		if (!data.fullMarks) {
			show({
				summary: "WARNING",
				type: "warn",
				detail: "Please add marks",
			});
			return;
		}
		console.log(data)
		setDisable(true);
		axios
			.post(`/api/exam/set-exam`, data)
			.then((response) => {
				console.log(response.data);

				show({
					summary: "Added",
					type: "success",
					detail: response.data.message,
				});
				reset();
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
			<InputFields name={"title"} value={values?.title} setValue={setValues} />
			<div className="space-y-2">
				<div className="flex flex-wrap w-full">
					<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
						Caption
					</label>
					<textarea
						name="caption"
						id="caption"
						value={values?.caption}
						className="flex-grow flex-shrink basis-44 rounded-md p-1 h-20 focus:outline outline-[3px] outline-teal-500/30 transition-all resize-none bg-[#393E46]"
						onChange={(e) => {
							setValues((prev) => ({ ...prev, caption: e.target.value }));
						}}
					></textarea>
				</div>
				<div className="flex flex-wrap w-full">
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
				<div className="flex flex-wrap w-full">
					<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
						Batch
					</label>
					<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
						<Select
							options={batchValues}
							handleChange={setBatch}
							value={values?.batch}
							placeholder={"Batch"}
						/>
					</div>
				</div>
				<div className="flex flex-wrap w-full">
					<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
						Mode
					</label>
					<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
						<Select
							options={modeValues}
							handleChange={(e) => {
								setMode(e.value);
							}}
							value={mode}
							placeholder={"Select mode"}
						/>
					</div>
				</div>
				<div className="flex justify-between flex-wrap">
					<label
						htmlFor="minmax"
						className="font-bold block mb-2 flex-grow flex-shrink basis-16"
					>
						marks
					</label>
					<InputNumber
						inputId="minmax"
						value={values?.fullMarks}
						onValueChange={(e: InputNumberValueChangeEvent) => {
							setValues((prev) => ({ ...prev, fullMarks: e.value ?? null }));
						}}
						min={0}
						max={100}
						className="flex-grow flex-shrink basis-24"
					/>
				</div>
				<div className="flex flex-wrap w-full">
					<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
						Date
					</label>
					<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
						<Calendar
							value={values!.date}
							onChange={(e: any) =>
								setValues((prev) => ({ ...prev, date: e.value }))
							}
							style={{ width: "100%" }}
							dateFormat="dd/mm/yy"
							minDate={new Date()}
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
			</div>
		</form>
	);
}

export default memo(ExamForm);
