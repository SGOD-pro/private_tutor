"use client";

import AddStudent from "./components/AddStudent";
import ExamForm from "./components/ExamForm";
import Table from "./components/Table";
import SimpleCard from "./components/SimpleCard";
import AddSubject from "./components/AddSubject";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSubject } from "@/store/slices/Subjects";
import { setAllStudents, popStudent } from "@/store/slices/Students";
export default function Home() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [btnDisable, setBtnDisable] = useState(false);

	const subjects = useSelector((state: any) => state.Subjects.allSubjects);
	const students = useSelector((state: any) => state.Students.allStudents);
	const columns = [
		{ field: "admissionNo", header: "Admission No" },
		{ field: "name", header: "Full name" },
		{ field: "subject", header: "Subjects" },
	];
	useEffect(() => {
		if (!students[0].admissionNo || students[0].admissionNo.trim() === "") {
			axios
				.get("/api/students/getStudents")
				.then((response) => {
					dispatch(setAllStudents(response.data.data));
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {});
		} else {
		}
	}, []);

	useEffect(() => {
		console.log("kii");

		if (
			subjects?.length > 0 &&
			(!subjects[0].subject || subjects[0].subject.trim() === "")
		) {
			axios
				.get("/api/subjects/getsubjects")
				.then((response) => {
					dispatch(setSubject(response.data.allSubjects));
				})
				.catch((error) => {
					console.log(error);
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
			return response.data.status;
		} catch (error) {
			console.error("Error occurred while deleting:", error);
			return false;
		}
	};


	return (
		<div className="grid grid-cols-1 lg:grid-cols-[2.5fr,1fr] w-full h-full md:gap-3 gap-1 ">
			<div className=" w-full overflow-auto h-full flex flex-col">
				<div className="md:min-h-[360px] md:max-h-[450px] grid md:grid-cols-[1.3fr,1fr] gap-2 grid-cols-1 h-fit">
					<div className="rounded-md md:rounded-lg border border-[#EEEEEE]/60 md:rounded-tl-[2.5rem] rounded-tl-2xl  overflow-hidden relative h-full">
						{loading ? (
							<div
								className={`absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 `}
							></div>
						) : (
							<div className={`w-full h-full pl-3 p-1`}>
								<h2 className="text-2xl my-1 capitalize font-semibold">
									add student
								</h2>
								<AddStudent />
							</div>
						)}
					</div>

					<div className="rounded-md md:rounded-lg border border-[#EEEEEE]/60 overflow-y-auto relative h-full pb-2">
						{loading ? (
							<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 "></div>
						) : (
							<div className={`w-full p-2 opacity-1`}>
								<h2 className="text-2xl my-2 capitalize font-semibold">
									add exam
								</h2>
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
							<h2 className="text-xl capitalize p-2 font-semibold sticky top-0 z-10 bg-[#393E46]">
								recent students
							</h2>
							<Table
								columns={columns}
								values={students}
								deleteFunction={deleteFunction}
							/>
						</div>
					)}
				</div>
			</div>
			<div className="bg  w-full hidden lg:block min-w-44">
				<div className="rounded-md md:rounded-lg border border-[#EEEEEE]/60 overflow-hidden relative">
					<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 hidden"></div>
					<div className={`w-full h-full p-2 opacity-1`}>
						<SimpleCard batch={"Python"} time={"1:00:3:00"} />
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
