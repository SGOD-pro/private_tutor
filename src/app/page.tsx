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
import Loading from "./components/Loading";

export type StudentDetailsInterface = {
	admissionNo: string;
	picture: string | null | File;
	subjects: string[] | null | string;
	name: string;
	clg: boolean;
	stream: string;
	fees: number;
	phoneNo: string[] | null;
	_id?: string;
};

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
			const response = await axios.get(`/api/students/deleteStudent?id=${id}`);
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
		subjects: [],
		name: "",
		clg: false,
		stream: "",
		fees: 0,
		phoneNo: [],
	});

	const [update, setUpdate] = useState(false);
	const [subject, setSubject] = useState<any[]>([]);
	const [key, setKey] = useState(0);
	const editFunction = (data: StudentDetailsInterface) => {
		const subjectList = data.subjects
			? typeof data.subjects === "string"
				? data.subjects.includes(",")
					? data.subjects
							.split(",")
							.map((item: string): { name: string } => ({ name: item.trim() }))
					: [{ name: data.subjects.trim() }]
				: data.subjects.map((item: string): { name: string } => ({
						name: item.trim(),
				  }))
			: [];
		setSubject(subjectList);
		console.log(data);
		setValues({
			admissionNo: data.admissionNo,
			picture: data.picture,
			subjects: data.subjects,
			name: data.name,
			clg: data.clg,
			stream: data.stream,
			phoneNo: data.phoneNo,
			fees: data.fees,
		});
		if (data._id) localStorage.setItem("id", data._id);
		setUpdate(true);
		setKey((prev) => prev + 1);
	};
	return (
		<div className="grid grid-cols-1 lg:grid-cols-[2.5fr,1fr] w-full h-full lg:overflow-hidden overflow-auto custom-scrollbar gap-3">
			<div className=" flex flex-col gap-2">
			<div className="md:h-1/2 rounded-lg sm:rounded-tl-[20px] md:rounded-tl-[44px] border border-slate-400/70 p-3 md:p-3 md:pl-8 md:overflow-auto relative transition-all">
					<Loading loading={loading}>
						<AddStudent
							values={values}
							setValues={setValues}
							update={update}
							setUpdate={setUpdate}
							subject={subject}
							cols={2}
							key={key}
						/>
					</Loading>
				</div>
				<div className="md:h-[calc(50%-3.1rem)] max-h-[70vh] rounded-lg sm:rounded-bl-[20px] md:rounded-bl-[44px] border border-slate-400/70 overflow-auto relative custom-scrollbar transition-all">
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
					<Loading loading={loading}>
						<Table
							columns={columns}
							values={students}
							deleteFunction={deleteFunction}
							editFunction={editFunction}
						/>
					</Loading>
				</div>
			</div>
			<div className="hidden lg:flex min-w-72 flex-col gap-3 relative rounded-lg overflow-hidden">
				<Loading loading={loading}>
					<div className="h-40 w-full relative border border-slate-400/60 rounded-lg">
						<SimpleCard />
					</div>
					<div className=" w-full relative border border-slate-400/60 rounded-lg p-2">
						<h2 className="text-lg font-semibold">Add exam</h2>
						<AddSubject />
					</div>
					<div className=" w-full relative border border-slate-400/60 rounded-lg p-2">
						<h2 className="text-lg font-semibold">Add exam</h2>
						<ExamForm />
					</div>
				</Loading>
			</div>
		</div>
	);
}
