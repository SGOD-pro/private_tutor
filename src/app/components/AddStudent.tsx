import React, { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from "primereact/dropdown";
import InputFields from "./InputFields";
import { useSelector, useDispatch } from "react-redux";
import { pushStudent } from "@/store/slices/Students";
import { AppDispatch } from "@/store/store";
import { showToast } from "@/store/slices/Toast";

import axios from "axios";
function AddStudent() {
	const [selectedSubjects, setSelectedSubjects] = useState([]);
	const dispatch = useDispatch();
	const [values, setValues] = useState({
		admissionNo: "",
		picture: null,
		subject: null,
		name: "",
	});
	const addDispatch: AppDispatch = useDispatch();
	interface toast {
		summary: string;
		detail: string;
		type: string;
	}
	const show = ({ summary, detail, type }: toast) => {
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
	const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		console.log(values);
		event.preventDefault();
		setLoading(true);
		axios
			.post(`/api/students/setStudent`, values, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				console.log(response.data);
				dispatch(pushStudent(response.data.data));
				setValues({
					admissionNo: "",
					picture: null,
					subject: null,
					name: "",
				})
				setSelectedSubjects([])
				setKey(prevKey => prevKey + 1);
				show({summary:"Added",type:"success",detail:"Student added successfully"})
			})
			.catch((error) => {
				console.log(error);
				show({summary:"Error",type:"success",detail:error.message});
			})
			.finally(() => {
				setLoading(false);
			});
	};
	const AllSubjects = useSelector((state: any) => state.Subjects.allSubjects);
	const subjects = AllSubjects.map((subject: any) => ({
		name: subject.subject,
	}));
	useEffect(() => {
        if (Array.isArray(lastAdmission)) {
            updateAddNo()
        }
    }, [lastAdmission]);

	return (
		<form className="w-full h-full" onSubmit={handelSubmit}>
			<InputFields
				name={"admissionNo"}
				value={values.admissionNo}
				setValue={setValues}
				readOnly={true}
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
				<button
					className="px-3 py-1 text-lg rounded-md bg-[#393E46]"
					disabled={loading}
				>
					Add
					{loading && <i className="pi pi-spin pi-spinner"></i>}
				</button>
			</div>
		</form>
	);
}

export default AddStudent;