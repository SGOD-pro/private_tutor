import React, { useState, useEffect, useRef, use } from "react";
import Popover from "../../components/Popover";
import InputFields from "../../components/InputFields";
import Icon from "@/app/components/Icon";
import { StudentDetailsInterface } from "../../page";
import Image from "next/image";
import { MultiSelect } from "primereact/multiselect";
import { useDispatch, useSelector } from "react-redux";
import QueryTable from "../../components/QueryTable";
import SetStudentBatch from "../../components/SetStudentBatch";
import Select from "../../components/Select";
import axios from "axios";
import { Batch } from "../../manageBatch/page";
import { AppDispatch } from "@/store/store";
import { StudentDelete } from "@/app/days/page";
import { showToast, ToastInterface } from "@/store/slices/Toast";
function AllStudents() {
	const [show, setShow] = useState<boolean>(false);
	const [show2, setShow2] = useState<boolean>(false);
	const addDispatch: AppDispatch = useDispatch();
	const [filtering, setFiltering] = useState<boolean>(false);
	const [loading, setLoading] = useState(true);
	const [values, setValues] = useState<StudentDetailsInterface>({
		admissionNo: "",
		picture: null,
		subjects: null,
		name: "",
	});
	const Tshow = ({ summary, detail, type }: ToastInterface) => {
		addDispatch(
			showToast({
				severity: type,
				summary,
				detail,
				visible: true,
			})
		);
	};
	const [imageSrc, setImageSrc] = useState<any>("");

	const fileInput = useRef<any>(null);
	const handleImage = () => {
		if (fileInput) {
			fileInput.current.click();
		}
	};

	const [key, setKey] = useState(0);
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

	const allSubject = useSelector((state: any) => state.Subjects.allSubjects);
	const subjects = allSubject.map((subject: any) => ({
		name: subject.subject,
	}));
	interface selectedSubject {
		code: string;
		name: string;
	}
	const [selectedSubject, setSelectedSubject] =
		useState<selectedSubject | null>(null);

	const [data, setData] = useState<StudentDetailsInterface[]>([]);
	const [filteredValue, setFilteredValue] = useState<StudentDetailsInterface[]>(
		[]
	);
	const [skip, setSkip] = useState(0);
	const [limit, setLimit] = useState(10);
	const [hasMore, setHasMore] = useState(true);

	const fetchData = async () => {
		axios
			.get(`/api/students/get-all-students?skip=${skip}&limit=${limit}`)
			.then((response) => {
				if (response.data?.data?.length !== 10) {
					setHasMore(false);
				}
				setData(response.data.data);
				setFilteredValue(response.data.data);
				if (skip === 0 && data.length === 0) {
					Tshow({
						type: "success",
						summary: "Fetched",
						detail: response.data.message,
					});
				}
			})
			.catch((errror) => {
				if (skip === 0) {
					Tshow({
						type: "error",
						summary: "Error",
						detail: errror.response?.data?.message || "An error occurred.",
					});
				}
			})
			.finally(() => {
				if (skip === 0) {
					setLoading(false);
				}
			});
	};
	const fetchMoreData = () => {
		setSkip((prev) => prev + limit);
		setLimit((prev) => prev + 10);
	};
	useEffect(() => {
		localStorage.clear();
		if (data.length !== 0) {
			//setLoading(false);
		}
		fetchData();
	}, [limit, skip]);

	interface ActionComponentProps {
		rowData: any;
	}

	const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);
	const [modifingData, setModifingData] = useState(false);
	const editFunction = (data: any) => {
		setShow2(false);
		setShow(true);
		console.log(data);
		localStorage.clear();
		const subs = data.subjects
			?.split(",")
			.map((s: any) => ({ name: s.trim() }));
		console.log(subs);
		setSelectedSubjects(subs);
		setImageSrc(data.picture);
		setValues({
			admissionNo: data.admissionNo,
			picture: data.picture,
			name: data.name,
			subjects: subs,
		});
		localStorage.setItem("id", data._id);
	};

	interface SubjectObject {
		[key: string]: { code: string; name: string }[];
	}
	const [batchDetails, setBatchDetails] = useState<SubjectObject>({});
	const [batchSubjects, setBatchSubjects] = useState<string[]>([]);
	function constructObject(data: { subjectWiseBatches: Batch[][] }): void {
		const result: SubjectObject = {};
		data.subjectWiseBatches.forEach((batchArray) => {
			batchArray.forEach((batch) => {
				const { _id, subject, days } = batch;
				if (!result.hasOwnProperty(subject)) {
					result[subject] = [];
				}
				result[subject].push({ name: _id, code: days.join(",") });
			});
		});
		setBatchDetails(result);
	}
	const setBatch = (data: any) => {
		setShow(false);
		setShow2(true);
		const { _id, subjectWiseBatches, subjects } = data;
		localStorage.setItem("id", _id);
		constructObject({ subjectWiseBatches });
		const s = subjects?.split(",");
		setBatchSubjects(s);
	};
	const [key1, setKey1] = useState(0);
	useEffect(() => {
		setKey1((prev) => prev + 1);
	}, [batchDetails]);

	const [search, setSearch] = useState<string>("");

	useEffect(() => {
		if (!selectedSubject && search.trim() === "") {
			return;
		}
		let filteredValues = data.filter((item) => {
			const nameField = item.name || "";
			const regex = new RegExp(search, "i");
			return regex.test(nameField);
		});
		if (selectedSubject) {
			filteredValues = filteredValues.filter((item) => {
				const nameField = item.subjects || "";
				const regex = new RegExp(
					`(^|,)\\s*${selectedSubject.name?.trim()}\\s*(,|$)`,
					"i"
				);
				return regex.test(nameField);
			});
		}
		setFilteredValue(filteredValues);
	}, [search, selectedSubject]);

	const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		if (e.target.value.trim() === "" && !selectedSubject) {
			setFilteredValue(data);
			setFiltering(false);
			return;
		}
		setFiltering(true);
	};
	const [tableKey, setTableKey] = useState(0);
	const [updating, setUpdating] = useState(false);
	const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const id = localStorage.getItem("id");
		if (!id) {
			return;
		}
		const subs = selectedSubjects.map((item: any) => item.name);
		const Newdata = { ...values, subject: subs };
		setUpdating(true);
		axios
			.post(`/api/students/update-student?id=${id}`, Newdata, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				const newdata = data;
				for (let i = 0; i < newdata.length; i++) {
					if (newdata[i]._id === response.data.data._id) {
						newdata[i] = response.data.data;
						break;
					}
				}
				setData(newdata);
				const Fdata = filteredValue;
				for (let i = 0; i < newdata.length; i++) {
					if (newdata[i]._id === response.data.data._id) {
						newdata[i] = response.data.data;
						break;
					}
				}
				setFilteredValue(Fdata);
				Tshow({
					summary: "Updated",
					type: "success",
					detail: response.data.message,
				});
				localStorage.clear();
				setTableKey((prev) => prev + 1);
			})
			.catch((error) => {
				Tshow({
					summary: "Error",
					type: "error",
					detail: error.response.data.message || "Internal server error",
				});
			})
			.finally(() => {
				setUpdating(false);
			});
	};
	const setSubject = (e: any) => {
		setFiltering(true);

		setSelectedSubject(e.value);
	};

	const ActionComponent: React.FC<ActionComponentProps> = ({ rowData }) => {
		const [disable, setDisable] = useState(false);
		const deleteFunction = async (id: string) => {
			setDisable(true);
			await StudentDelete(id);
			setDisable(false);
			setTableKey((prev) => prev + 1);
		};
		return (
			<div className="flex gap-2">
				<button
					className="bg-gradient-to-tl shadow-md active:scale-95 transition-all active:shadow-none to-red-400 from-red-700 rounded-lg p-3 grid place-items-center"
					onClick={() => deleteFunction(rowData._id)}
					disabled={disable}
				>
					{!disable ? (
						<i className="pi pi-user-minus"></i>
					) : (
						<i className="pi pi-spin pi-spinner"></i>
					)}
				</button>
				<button
					className="bg-gradient-to-tl shadow-md active:scale-95 transition-all active:shadow-none to-emerald-400 from-emerald-700 rounded-lg p-3 grid place-items-center"
					onClick={() => editFunction(rowData)}
					disabled={disable}
				>
					<i className="pi pi-pen-to-square"></i>
				</button>
				<button
					className="bg-gradient-to-tl shadow-md active:scale-95 transition-all active:shadow-none to-amber-400 from-amber-700 rounded-lg p-3 grid place-items-center"
					onClick={() => setBatch(rowData)}
					disabled={disable}
				>
					<i className="pi pi-plus"></i>
				</button>
			</div>
		);
	};

	return (
		<>
			<Popover show={show} setShow={setShow}>
				<form
					action=""
					className="p-2 rounded-lg text-xl w-full h-full min-w-80 items-center"
					onSubmit={handelSubmit}
					encType="multipart/form-data"
				>
					<div className="grp flex flex-wrap">
						<InputFields
							name={"admissionNo"}
							value={values.admissionNo}
							setValue={setValues}
						/>
					</div>
					<div className="grp flex  flex-wrap">
						<InputFields
							name={"name"}
							value={values.name}
							setValue={setValues}
							type={"text"}
						/>
					</div>
					<div className="relative flex flex-wrap items-center mb-3">
						<input
							type="file"
							accept="image/*"
							className="invisible absolute"
							ref={fileInput}
							onChange={handleFileChange}
							id="image"
						/>
						<label htmlFor="image" className="basis-24 ">
							Photo
						</label>
						<div
							className="w-24 h-24 ml-5 border rounded-full relative overflow-hidden grid place-content-center cursor-pointer "
							onClick={handleImage}
						>
							{imageSrc ? (
								<Image
									src={imageSrc}
									alt="not upl0ded"
									className="absolute w-[150%] h-[150%] object-cover object-top"
									id="profile-pic"
									width={100}
									height={100}
									key={key}
								></Image>
							) : (
								<Icon
									src={"https://cdn.lordicon.com/bgebyztw.json"}
									secondaryColor={"#EEEEEE"}
								/>
							)}
						</div>
					</div>
					<div className="flex flex-wrap">
						<label
							htmlFor="subjects"
							className=" flex-shrink flex-grow basis-5"
						>
							Subjects
						</label>
						<MultiSelect
							value={selectedSubjects}
							onChange={(e) => {
								setSelectedSubjects(e.value);
							}}
							id="subjects"
							options={subjects}
							optionLabel="name"
							placeholder="Subjects"
							className="flex-grow flex-shrink basis-44 rounded-md text-sm bg-[#393E46]"
						/>
					</div>
					<div className="text-right mt-4">
						<button
							className="bg-gradient-to-tl to-blue-400 from-blue-700 rounded-md text-2xl"
							disabled={updating}
						>
							{!updating ? (
								<i className="pi pi-user-edit px-4 py-1 text-2xl"></i>
							) : (
								<i className="pi pi-spin pi-spinner px-4 py-1 text-2xl"></i>
							)}
						</button>
					</div>
				</form>
			</Popover>

			<Popover show={show2} setShow={setShow2}>
				<SetStudentBatch
					batchProps={batchDetails}
					key={key1}
					subjects={batchSubjects}
				/>
			</Popover>

			<div className="w-full h-full overflow-hidden rounded-l-[2rem]">
				<header className="w-full h-14 p-1">
					<div className="flex w-full gap-3 justify-end items-center">
						<h2 className="text-xl">
							Filters{" "}
							<i
								className={`pi ${
									!filtering ? "pi-filter" : "pi-filter-slash"
								} p-4 rounded-full cursor-pointer hover:bg-slate-100/20`}
								onClick={() => {
									setFilteredValue(data);
									setFiltering(false);
									setSelectedSubject(null);
									setSearch("");
								}}
							></i>
						</h2>
						<input
							type="text"
							className="rounded-md bg-[#393E46] p-2 outline-none  px-3"
							placeholder="Search by name"
							onChange={onSearchChange}
							value={search}
							disabled={loading}
						/>
						<div className="min-w-44">
							{loading && (
								<div className="absolute w-full animate-pulse z-10 bg-[#393E46]/70 "></div>
							)}

							<Select
								value={selectedSubject}
								handleChange={setSubject}
								options={subjects}
								placeholder={""}
							></Select>
						</div>
					</div>
				</header>
				<div className="w-full h-[calc(100%-60px)] overflow-auto custom-scrollbar relative">
					{loading ? (
						<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 "></div>
					) : (
						<QueryTable
							columns={[
								{ header: "Name", field: "name" },
								{ header: "Admission No.", field: "admissionNo" },
								{ header: "Subjects", field: "subjects" },
							]}
							values={filteredValue}
							Components={ActionComponent}
							key={tableKey}
						></QueryTable>
					)}
				</div>
			</div>
		</>
	);
}

export default AllStudents;
