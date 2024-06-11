import React, { useState, useEffect, useRef, useCallback } from "react";
import Popover from "../../components/Popover";
import { StudentDetailsInterface } from "../../page";
import { useDispatch, useSelector } from "react-redux";
import QueryTable from "../../components/QueryTable";
import SetStudentBatch from "../../components/SetStudentBatch";
import Select from "../../components/Select";
import axios from "axios";
import { Batch } from "../../manageBatch/page";
import { AppDispatch } from "@/store/store";
import { showToast, ToastInterface } from "@/store/slices/Toast";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "@/app/components/Loader";
import AddStudent from "@/app/components/AddStudent";
function AllStudents() {
	const [show, setShow] = useState<boolean>(false);
	const [show2, setShow2] = useState<boolean>(false);
	const addDispatch: AppDispatch = useDispatch();
	const [filtering, setFiltering] = useState<boolean>(false);
	const [loading, setLoading] = useState(true);
	const [values, setValues] = useState<StudentDetailsInterface>({
		admissionNo: "",
		institutionName: "",
		picture: null,
		subjects: [],
		name: "",
		clg: false,
		stream: "",
		fees: 0,
		phoneNo: [],
	});

	const Tshow = useCallback(({ summary, detail, type }: ToastInterface) => {
		addDispatch(
			showToast({
				severity: type,
				summary,
				detail,
				visible: true,
			})
		);
	}, []);

	const allSubject = useSelector((state: any) => state.Subjects.allSubjects);
	const subjects = allSubject.map((subject: any) => ({
		name: subject.subject,
	}));
	interface selectedSubject {
		code: string;
		name: string;
	}

	const [data, setData] = useState<StudentDetailsInterface[]>([]);
	const [filteredValue, setFilteredValue] = useState<StudentDetailsInterface[]>(
		[]
	);

	const [selectedSubject, setSelectedSubject] =
		useState<selectedSubject | null>(null);
	const [skip, setSkip] = useState(0);
	const [limit, setLimit] = useState(10);
	const [hasMore, setHasMore] = useState(true);

	const fetchData = async () => {
		//use dispatch and selector
		if (skip === 0) {
			setLoading(true);
		}
		axios
			.get(
				`/api/students/get-all-students?skip=${skip}&limit=${limit}&subject=${selectedSubject}`
			)
			.then((response) => {
				if (response.data?.data?.length !== 10) {
					setHasMore(false);
				}
				if (skip === 0 && data.length === 0) {
					setData(response.data.data);
					setFilteredValue(response.data.data);
					Tshow({
						type: "success",
						summary: "Fetched",
						detail: response.data.message,
					});
				} else {
					setData((prev) => [...prev, ...response.data.data]);
					setFilteredValue((prev) => [...prev, ...response.data.data]);
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
			setLoading(false);
		}
		// TODO: set condition if selector is empty or not the call fetchdata
		fetchData();
	}, [limit, skip]);

	interface ActionComponentProps {
		rowData: any;
	}

	const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);
	const [formKey, setFormKey] = useState(0);
	const editFunction = (data: any) => {
		setShow2(false);
		setShow(true);
		setFormKey((prev) => prev + 1);
		console.log(data);
		localStorage.clear();
		const subs = data.subjects
			?.split(",")
			.map((s: any) => ({ name: s.trim() }));
		console.log(subs);
		setSelectedSubjects(subs);
		setValues({
			institutionName: data.institutionName,
			admissionNo: data.admissionNo,
			picture: data.picture,
			subjects: data.subjects,
			name: data.name,
			clg: data.clg,
			stream: data.stream,
			phoneNo: data.phoneNo,
			fees: data.fees,
		});
		localStorage.setItem("_id", data._id);
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
		const id = localStorage.getItem("id");
		if (id && _id === id) {
			console.log("return");
			return;
		}
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
				const subjectsField = item.subjects;
				if (typeof subjectsField === "string") {
					const regex = new RegExp(
						`(^|,)\\s*${selectedSubject.name?.trim()}\\s*(,|$)`,
						"i"
					);
					return regex.test(subjectsField);
				} else if (Array.isArray(subjectsField)) {
					const joinedSubjects = subjectsField.join(",");
					const regex = new RegExp(
						`(^|,)\\s*${selectedSubject.name?.trim()}\\s*(,|$)`,
						"i"
					);
					return regex.test(joinedSubjects);
				} else {
					return false;
				}
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

	const setSubject = (e: any) => {
		setFiltering(true);
		setSelectedSubject(e.value);
	};

	const ActionComponent: React.FC<ActionComponentProps> = ({ rowData }) => {
		const [disable, setDisable] = useState(false);
		const deleteFunction = async (id: string) => {
			console.log(id);
			setDisable(true);
			axios
				.get(`/api/students/deleteStudent?id=${id}`)
				.then(() => {
					const updatedData = data.filter((item) => item._id !== id);
					setData(updatedData);
					setFilteredValue(updatedData);
					setTableKey((prev) => prev + 1);
				})
				.catch((error) => {
					Tshow({
						summary: "Error",
						type: "error",
						detail:
							error.response.data.message ||
							"Cannot delete! Internal server error",
					});
				})
				.finally(() => {
					setDisable(false);
				});
		};
		return (
			<div className="flex gap-2">
				<button
					className="bg-gradient-to-tl shadow-md shadow-black active:scale-95 transition-all active:shadow-none to-red-400 from-red-700 rounded-lg p-3 grid place-items-center"
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
					className="bg-gradient-to-tl shadow-md shadow-black active:scale-95 transition-all active:shadow-none to-emerald-400 from-emerald-700 rounded-lg p-3 grid place-items-center"
					onClick={() => editFunction(rowData)}
					disabled={disable}
				>
					<i className="pi pi-pen-to-square"></i>
				</button>
				<button
					className="bg-gradient-to-tl shadow-md shadow-black active:scale-95 transition-all active:shadow-none to-amber-400 from-amber-700 rounded-lg p-3 grid place-items-center"
					onClick={() => setBatch(rowData)}
					disabled={disable}
				>
					<i className="pi pi-plus"></i>
				</button>
			</div>
		);
	};
const [showNav, setShowNav] = useState(false)
	return (
		<>
			<Popover show={show} setShow={setShow}>
				<AddStudent
					values={values}
					setValues={setValues}
					update={true}
					subject={selectedSubjects}
					cols={1}
					key={formKey}
				/>
			</Popover>

			<Popover show={show2} setShow={setShow2}>
				<SetStudentBatch
					batchProps={batchDetails}
					key={key1}
					subjects={batchSubjects}
				/>
			</Popover>

			<div className="w-full h-full overflow-hidden rounded-l-[2rem] relative">
				<div className="text-right py-1 px-2 sm:hidden bg-slate-900">
					<i className="pi pi-align-justify p-2  relative z-50 bg-slate-700 rounded-md cursor-pointer" onClick={()=>{
						setShowNav(prev=>!prev)
					}}></i>
				</div>
				<header className={`w-full sm:h-14 p-1 py-4 sm:py-1 absolute  transition-all z-40 bg-slate-900 sm:relative sm:translate-y-0 ${showNav?'translate-y-0':'-translate-y-full'} top-0 sm:bg-[#1F2937] sm:border-b shadow-md shadow-black rounded-b-xl sm:rounded-none sm:shadow-none`}>
					<div className="flex w-full gap-2 justify-end sm:items-center flex-col sm:flex-row items-start">
						<h2 className="text-lg  mt-4 sm:mt-0 pl-2 sm:pl-0">
							Filters
							<i
								className={`pi ${
									!filtering ? "pi-filter" : "pi-filter-slash"
								} p-3 ml-1 rounded-full cursor-pointer hover:bg-slate-100/20`}
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
							className="rounded-md bg-[#393E46] p-2 outline-none w-full sm:w-48 px-3"
							placeholder="Search by name"
							onChange={onSearchChange}
							value={search}
							disabled={loading}
						/>
						<div className="sm:min-w-44 sm:w-56 w-full">
							{loading && (
								<div className="absolute w-full animate-pulse z-10 bg-[#393E46]/70 "></div>
							)}

							<Select
								value={selectedSubject}
								handleChange={setSubject}
								options={subjects}
								placeholder={"Subjects"}
							></Select>
						</div>
					</div>
				</header>
				<div
					className="w-full h-[calc(100%-60px)] overflow-auto custom-scrollbar relative"
					id="scrollableDiv"
				>
					{loading ? (
						<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 "></div>
					) : (
						<InfiniteScroll
							dataLength={data?.length || 0}
							next={fetchMoreData}
							hasMore={hasMore}
							loader={<Loader />}
							scrollableTarget="scrollableDiv"
						>
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
						</InfiniteScroll>
					)}
				</div>
			</div>
		</>
	);
}

export default AllStudents;
