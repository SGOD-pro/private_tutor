import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import { MultiSelect } from "primereact/multiselect";
import InputFields from "./InputFields";
import { useSelector, useDispatch } from "react-redux";
import { pushStudent, updateStudent } from "@/store/slices/Students";
import { AppDispatch } from "@/store/store";
import { showToast } from "@/store/slices/Toast";
import axios from "axios";
import { ToastInterface } from "@/store/slices/Toast";
import {
	pushStudentByBatch,
	updateStudentsToBatch,
} from "@/store/slices/BatchStudents";
import { StudentDetailsInterface } from "../page";
import Select from "./Select";
import Image from "next/image";
import Icon from "./Icon";
interface selectedSubjectsInterface {
	name: string;
	code: string;
}
function AddStudent({
	values,
	setValues,
	update,
	setUpdate,
	subject,
	cols,
}: {
	values: StudentDetailsInterface;
	setValues: React.Dispatch<React.SetStateAction<StudentDetailsInterface>>;
	setUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
	update: boolean;
	subject: any[];
	cols: number;
}) {
	console.log("rerendering add-student");
	const [selectedSubjects, setSelectedSubjects] = useState<
		selectedSubjectsInterface[] | null
	>(null);

	const [studyIn, setStudyIn] = useState<any | null>(null);
	const options = [
		{ name: "School", code: "School" },
		{ name: "Collage", code: "Collage" },
	];
	const setStudy = (e: any) => {
		setStudyIn(e.value);
		console.log(e.value);
		const v = e.value.name === "School" ? false : true;
		setValues((prev) => ({ ...prev, clg: v }));
	};

	const [imageSrc, setImageSrc] = useState<any>("");
	const fileInput = useRef<any>(null);
	const handleImage = () => {
		if (fileInput) {
			fileInput.current.click();
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const file = e.target.files?.[0];
		if (file) {
			setValues((prev) => ({
				...prev,
				picture: file,
			}));
			const reader = new FileReader();
			reader.onloadend = () => {
				setImageSrc(reader.result);
				setKey((prev) => prev + 1);
			};
			reader.readAsDataURL(file);
		}
	};

	const dispatch = useDispatch();

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
	const [loading, setLoading] = useState(false);
	const lastAdmission = useSelector((state: any) => state.Students.allStudents);
	const [adno, setAdno] = useState(0);
	function updateAddNo() {
		const lastStudent = lastAdmission[0];
		const lastDigit = lastStudent?.admissionNo?.split("-");
		const newAddNo = `CA-${new Date().getFullYear() % 100}/${
			(new Date().getFullYear() % 100) + 1
		}-${
			(lastDigit && Array.isArray(lastDigit) && +lastDigit[lastDigit.length - 1]
				? +lastDigit[lastDigit.length - 1]
				: 0) + 1
		}`;
		setValues((prev) => ({ ...prev, admissionNo: newAddNo }));
		setAdno((prev) => prev + 1);
	}

	useEffect(() => {
		if (selectedSubjects) {
			const subs = selectedSubjects.map((item: any) => item.name);
			setValues((prevValues: any) => ({
				...prevValues,
				subject: subs,
			}));
		}
	}, [selectedSubjects]);
	const [key, setKey] = useState(0);
	const [disable, setDisable] = useState(false);

	function validateForm() {
		if (!values.admissionNo.trim()) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "Admission number is required.",
			});
			return false;
		}
		if (!values.institutionName.trim()) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "Instituon name is required.",
			});
			return false;
		}
		if (!values.name.trim()) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "Name is required.",
			});
			return false;
		}
		if (values.subjects === null || values.subjects.length === 0) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "At least one subject is required.",
			});
			return false;
		}
		if (!values.stream.trim()) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "Stream is required.",
			});
			return false;
		}
		if (values.fees <= 0) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "Fees must be greater than zero.",
			});
			return false;
		}
		if (values.phoneNo === null || values.phoneNo.length === 0) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "At least one phone number is required.",
			});
			return false;
		}

		return true;
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		let url = `/api/students/setStudent`;
		let adno = values.admissionNo;
		if (update) {
			const id = localStorage.getItem("id");
			if (!id) {
				return;
			}
			url = `/api/students/update-student?id=${id}`;
		}
		if (!validateForm()) {
			return;
		}
		setDisable(true);
		axios
			.post(url, values, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				if (update) {
					dispatch(updateStudent(response.data.data));
					dispatch(updateStudentsToBatch(response.data.data));
				} else {
					dispatch(pushStudent(response.data.data));
					dispatch(pushStudentByBatch(response.data.data));
				}
				setValues({
					admissionNo: "",
					picture: null,
					subjects: [],
					name: "",
					clg: false,
					stream: "",
					fees: 0,
					institutionName: "",
					phoneNo: [],
				});
				if (!response.data.success) {
					show({
						summary: update ? "Updated" : "Added",
						type: "warning",
						detail: response.data.message,
					});
				}
				setSelectedSubjects(null);
				setKey((prevKey) => prevKey + 1);

				show({
					summary: update ? "Updated" : "Added",
					type: "success",
					detail: response.data.message,
				});
			})
			.catch((error) => {
				show({
					summary: "Error",
					type: "error",
					detail: error.response.data.message || error.message,
				});
			})
			.finally(() => {
				updateAddNo();
				setDisable(false);
				if (setUpdate) {
					setUpdate(false);
				}
				localStorage.clear();
			});
	};
	const AllSubjects = useSelector((state: any) => state.Subjects.allSubjects);
	const subjects = useCallback(
		AllSubjects.map((subject: any) => ({
			name: subject.subject,
		})),
		[AllSubjects]
	);
	useEffect(() => {
		if (update) {
			setSelectedSubjects(subject);
			setImageSrc(values.picture);
			setStudyIn(
				values.clg
					? { name: "School", code: "School" }
					: { name: "Collage", code: "Collage" }
			);
		}
	}, []);
	useEffect(() => {
		if (Array.isArray(lastAdmission) && !update) {
			updateAddNo();
		}
	}, [lastAdmission]);

	useEffect(() => {
		console.log(values.admissionNo);
	}, [adno]);

	return (
		<form
			className={`w-full h-full grid gap-3 items-center ${
				cols === 2 ? "sm:grid-cols-2 grid-cols-1" : "grid-cols-1"
			} `}
			onSubmit={handleSubmit}
		>
			<InputFields
				name={"admissionNo"}
				value={values.admissionNo}
				setValue={setValues}
			/>
			<InputFields name={"name"} value={values.name} setValue={setValues} />
			<div className="flex flex-wrap items-center relative justify-start">
				<label htmlFor="" className="mr-14">
					Upload image
				</label>
				<input
					type="file"
					accept="image/*"
					className="invisible absolute"
					ref={fileInput}
					onChange={handleFileChange}
					id="image"
				/>
				<div
					className="w-16 h-16 ml-5 border rounded-full relative overflow-hidden grid place-content-center cursor-pointer"
					onClick={handleImage}
				>
					{imageSrc ? (
						<Image
							src={imageSrc}
							alt="not upl0ded"
							className="absolute w-[150%] h-[150%] object-cover object-top scale-150"
							id="profile-pic"
							width={100}
							height={100}
						/>
					) : (
						<Icon
							src={"https://cdn.lordicon.com/bgebyztw.json"}
							secondaryColor={"#EEEEEE"}
						/>
					)}
				</div>
			</div>
			<div className="card items-center flex flex-wrap w-full my-1 md:my-2">
				<label htmlFor="" className="flex-grow flex-shrink basis-28">
					Subjects
				</label>
				<div className="flex-grow flex-shrink basis-full sm:basis-44">
					<MultiSelect
						value={selectedSubjects}
						onChange={(e) => {
							setSelectedSubjects(e.value);
						}}
						options={subjects}
						optionLabel="name"
						placeholder="Select Subjects"
						maxSelectedLabels={3}
						className="text-sm bg-[#393E46] w-full"
					/>
				</div>
			</div>
			<div className="flex flex-wrap w-full my-1 md:my-2 items-center">
				<label htmlFor="" className="flex-grow flex-shrink basis-28">
					Select study in
				</label>
				<div className="flex-grow flex-shrink basis-full sm:basis-44">
					<Select
						value={studyIn}
						handleChange={setStudy}
						options={options}
						placeholder={"Select study in"}
					/>
				</div>
			</div>
			<InputFields name={"stream"} value={values.stream} setValue={setValues} />
			<InputFields
				name={"institutionName"}
				value={values.stream}
				setValue={setValues}
			/>
			<InputFields
				name={"phoneNo"}
				value={values.phoneNo}
				setValue={setValues}
				type={"number"}
			/>
			<InputFields
				name={"fees"}
				value={values.fees}
				setValue={setValues}
				type="number"
			/>
			<div className={`text-right ${cols===2&&'sm:col-start-2'}`}>
				{(update && setUpdate) && (
					<button
						className={`px-3 py-1 text-lg rounded-md active:scale-90 transition-all shadow-md shadow-black active:shadow-none bg-gradient-to-l to-red-400 from-red-700 mr-3`}
						disabled={disable}
						onClick={() => {
							setValues({
								admissionNo: "",
								picture: null,
								subjects: [],
								name: "",
								clg: false,
								stream: "",
								institutionName: "",
								fees: 0,
								phoneNo: [],
							});
							setSelectedSubjects(null);
							setImageSrc("")
							localStorage.clear();
							setUpdate(false);
							updateAddNo();
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
	);
}

export default memo(AddStudent);
