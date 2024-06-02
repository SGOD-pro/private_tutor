import React, { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { FileUpload } from "primereact/fileupload";
import InputFields from "./InputFields";
import { useSelector, useDispatch } from "react-redux";
import { pushStudent, updateStudent } from "@/store/slices/Students";
import { AppDispatch } from "@/store/store";
import { showToast } from "@/store/slices/Toast";
import axios from "axios";
import { ToastInterface} from "@/store/slices/Toast"
import {
	pushStudentByBatch,
	updateStudentsToBatch,
} from "@/store/slices/BatchStudents";
import { StudentDetailsInterface } from "../page";
function AddStudent({
	values,
	setValues,
	update,
	setUpdate,
	subject,
}: {
	values: StudentDetailsInterface;
	setValues: React.Dispatch<React.SetStateAction<StudentDetailsInterface>>;
	setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
	update: boolean;
	subject: any[];
}) {
	const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);
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
	const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		let url = `/api/students/setStudent`;
		if (update) {
			const id = localStorage.getItem("id");
			if (!id) {
				return;
			}
			url = `/api/students/update-student?id=${id}`;
		}
		console.log(values);
		
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
					subjects: null,
					name: "",
				});
				if (!response.data.success) {
					show({
						summary: update ? "Updated" : "Added",
						type: "warning",
						detail: response.data.message,
					});
				}
				setSelectedSubjects([]);
				setKey((prevKey) => prevKey + 1);

				show({
					summary: update ? "Updated" : "Added",
					type: "success",
					detail: response.data.message,
				});
			})
			.catch((error) => {
				show({ summary: "Error", type: "error", detail: error.message });
			})
			.finally(() => {
				setLoading(false);
				setUpdate(false);
				localStorage.clear();
				updateAddNo();
			});
	};
	const AllSubjects = useSelector((state: any) => state.Subjects.allSubjects);
	const subjects = AllSubjects.map((subject: any) => ({
		name: subject.subject,
	}));
	useEffect(() => {
		if (Array.isArray(lastAdmission) && !update) {
			updateAddNo();
		}
	}, [lastAdmission]);
	useEffect(() => {
		if (update) {
			setSelectedSubjects(subject);
		}
	}, []);

	return (
		<form className="w-full h-full" onSubmit={handelSubmit}>
			<InputFields
				name={"admissionNo"}
				value={values.admissionNo}
				setValue={setValues}
				readOnly={update}
			/>
			<InputFields name={"name"} value={values.name} setValue={setValues} />
			<div className="flex flex-wrap">
				<label htmlFor="" className="flex-grow flex-shrink basis-16">
					Upload image
				</label>
				<div className="card flex justify-content-center flex-shrink flex-grow basis-36 text-sm">
					<FileUpload
						mode="basic"
						name="photo"
						accept="image/*"
						key={key}
						maxFileSize={1000000}
						onSelect={(e: any) =>
							setValues((prev) => ({ ...prev, picture: e.files[0] }))
						}
						className="max-w-36"
						disabled={update}
					/>
				</div>
			</div>
			<div className="card  justify-content-center flex flex-wrap w-full my-3">
				<label htmlFor="" className="flex-grow flex-shrink basis-24">
					Subjects
				</label>
				<MultiSelect
					value={selectedSubjects}
					onChange={(e) => {
						setSelectedSubjects(e.value);
					}}
					options={subjects}
					optionLabel="name"
					placeholder="Select Subjects"
					maxSelectedLabels={3}
					className="flex-grow flex-shrink basis-44 rounded-md text-sm bg-[#393E46]"
				/>
			</div>

			<div className=" text-right">
				{update && (
					<button
						className={`px-3 py-1 text-lg rounded-md bg-gradient-to-l to-red-400 from-red-700 mr-3`}
						disabled={disable}
						onClick={() => {
							setValues({
								admissionNo: "",
								picture: null,
								subjects: null,
								name: "",
							});
							setSelectedSubjects([]);
							localStorage.clear();
							setUpdate(false);
							updateAddNo();
						}}
					>
						{loading ? (
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
					{loading && <i className="pi pi-spin pi-spinner ml-1"></i>}
				</button>
			</div>
		</form>
	);
}

export default AddStudent;
