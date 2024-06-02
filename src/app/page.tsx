"use client";

import AddStudent from "./components/AddStudent";
import ExamForm from "./components/ExamForm";
import Table from "./components/Table";
import SimpleCard from "./components/SimpleCard";
import AddSubject from "./components/AddSubject";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllStudents, popStudent } from "@/store/slices/Students";
import { AppDispatch } from "@/store/store";
import { showToast } from "@/store/slices/Toast";
import Link from "next/link";

export interface StudentDetailsInterface {
	admissionNo: string;
	picture: string | null | any;
	subjects: string | null;
	name: string;
	_id?: string;
}

export default function Home() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);

	const students = useSelector((state: any) => state.Students.allStudents);

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

	const columns = [
		{ field: "admissionNo", header: "Admission No" },
		{ field: "name", header: "Full name" },
		{ field: "subjects", header: "Subjects" },
	];
	useEffect(() => {
		if (students?.length === 0) {
			axios
				.get("/api/students/setStudent")
				.then((response) => {
					dispatch(setAllStudents(response.data.data));
					console.log(response.data.data);
					show({
						type: "success",
						summary: "Fetched",
						detail: "Successfully fetched students",
					});
				})
				.catch((error) => {
					console.log(error);
					show({
						type: "error",
						summary: "Error",
						detail: error.response.data.message,
					});
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}, []);

	type DeleteFunction = (id: string) => Promise<boolean>;

	const deleteFunction: DeleteFunction = async (id: string) => {
		try {
			const response = await axios.get(`/api/class-time/delete?_id=${id}`);
			dispatch(popStudent(id));
			return response.data.success;
		} catch (error) {
			console.error("Error occurred while deleting:", error);
			return false;
		}
	};
	const [values, setValues] = useState<StudentDetailsInterface>({
		admissionNo: "",
		picture: null,
		subjects: null,
		name: "",
	});
	const [update, setUpdate] = useState(false);
	const [subject, setSubject] = useState<any[]>([]);
	const [key, setKey] = useState(0);
	const editFunction = (data: any) => {
		const subject = data.subject
			? data.subject.includes(",")
				? data.subject
						.split(",")
						.map((item: any): { name: string } => ({ name: item.trim() }))
				: [{ name: data.subject.trim() }]
			: [];
		setSubject(subject);
		console.log(subject);
		
		setValues({
			admissionNo: data.admissionNo,
			picture: data.picture,
			subjects:subject,
			name: data.name,
		});

		localStorage.setItem("id", data._id);
		setUpdate(true);
		setKey((prev) => prev + 1);
	};
	return (
		<div className="grid grid-cols-1 lg:grid-cols-[2.5fr,1fr] w-full h-full md:gap-3 gap-1 overflow-auto">
			<div className=" w-full overflow-auto h-full flex flex-col">
				<div className="md:min-h-[360px] md:max-h-[450px] grid md:grid-cols-[1.3fr,1fr] gap-2 grid-cols-1 h-fit">
					<div className="rounded-md md:rounded-lg border border-[#EEEEEE]/60 md:rounded-tl-[2.5rem] rounded-tl-2xl overflow-auto  custom-scrollbar relative h-full">
						{loading ? (
							<div
								className={`absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 `}
							></div>
						) : (
							<div className={`w-full pl-3 p-1 `}>
								<h2 className="text-2xl my-1 capitalize font-semibold">
									add student
								</h2>
								<AddStudent
									values={values}
									setValues={setValues}
									update={update}
									setUpdate={setUpdate}
									subject={subject}
									key={key}
								/>
							</div>
						)}
					</div>

					<div className="rounded-md md:rounded-lg border border-[#EEEEEE]/60 custom-scrollbar overflow-y-auto relative h-full pb-2">
						{loading ? (
							<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 "></div>
						) : (
							<div className={`w-full p-2 opacity-1`}>
								<div className="flex items-center justify-between">
									<h2 className="text-2xl my-2 capitalize font-semibold">
										add exam
									</h2>
									<Link
										href="/all/show-exam"
										className="font-light text-emerald-500 text-sm hover:underline hover:opacity-70"
									>
										Vew all
									</Link>
								</div>
								<ExamForm />
							</div>
						)}
					</div>
				</div>

				<div className=" rounded-md md:rounded-lg border border-[#EEEEEE]/60 md:rounded-bl-[2.5rem] rounded-bl-2xl md:h-full h-[60%] overflow-auto mt-1 md:mt-3 relative custom-scrollbar">
					{loading ? (
						<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 "></div>
					) : (
						<div className="w-full h-full relative">
							<div className="flex items-center justify-between bg-[#393E46] w-full p-2 sticky top-0 z-10 ">
								<h2 className="text-xl capitalize font-semibold ">
									recent students
								</h2>
								<Link
									href="/all/all-students"
									className="font-light text-emerald-500 text-sm hover:underline hover:opacity-70"
								>
									All student
								</Link>
							</div>
							<Table
								columns={columns}
								values={students}
								deleteFunction={deleteFunction}
								editFunction={editFunction}
							/>
						</div>
					)}
				</div>
			</div>
			<div className="bg  w-full hidden lg:block min-w-44">
				<div className="rounded-md md:rounded-lg border border-[#EEEEEE]/60 overflow-hidden relative ">
					<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 hidden "></div>
					<div className="w-full h-44">
						{loading ? (
							<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 "></div>
						) : (
							<SimpleCard />
						)}
					</div>
				</div>
				<div className="rounded-md md:rounded-lg border border-[#EEEEEE]/60 overflow-hidden relative md:my-3 my-2">
					<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 hidden"></div>
					<div className={`w-full h-full p-2 opacity-1`}>
						<h2 className="text-2xl my-2 capitalize font-semibold">
							add subject
						</h2>
						<AddSubject />
					</div>
				</div>
			</div>
		</div>
	);
}
