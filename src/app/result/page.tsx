"use client";
import React, { useEffect, useState, useCallback } from "react";
import Popover from "../components/Popover";
import ExamForm from "../components/ExamForm";
import Table from "../components/Table";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllExam } from "@/store/slices/Exams";
import { RootState, AppDispatch } from "@/store/store";
import Loading from "../components/Loading";
import Link from "next/link";

function Result() {
	const dispatch = useDispatch();
	const apDispatch: AppDispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const allExams = useSelector((state: RootState) => state.Exams.allExams);
	useEffect(() => {
		if (Array.isArray(allExams) && allExams.length > 0) {
			return;
		}
		setLoading(true);
		axios
			.get("/api/exam/set-exam")
			.then((response) => {
				console.log(response.data.data);
				dispatch(setAllExam(response.data.data));
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);
	const deleteExam = (id: string) => {};
	return (
		<div>
			<Popover show={show} setShow={setShow}>
				<div className="" id="ExamForm">
					<h3 className="text-xl font-semibold">Exam form</h3>
					<ExamForm />
				</div>
			</Popover>
			<header className="flex items-stretch justify-between border-b border-slate-400/50 pb-2">
				<h2 className="text-2xl font-semibold pl-3 my-auto">Result{"/"}Exam</h2>
				<button
					className="border-2 text-teal-500 border-teal-500 rounded-md"
					onClick={() => {
						setShow(true);
					}}
					id="add-exam"
				>
					<i className="pi pi-plus-circle p-3 hover:bg-slate-400/20 pointer-events-none"></i>
				</button>
			</header>
			<main className="h-screen relative">
				<div className="h-full overflow-auto">
					<table className="table-auto w-full">
						<thead className="font-semibold uppercase text-gray-400 text-lg">
							<tr>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Subject</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Batch</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Date</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-right text-xl">Link</div>
								</th>
							</tr>
						</thead>
						<tbody className="text-sm divide-y divide-gray-100 relative">
							<Loading loading={loading}>
								{allExams?.map((item, index) => (
									<tr key={index} className="p-3">
										<td className="whitespace-nowrap p-3">
											<div className=" font-medium text-green-500">
												{item.subject}
											</div>
										</td>
										<td className="whitespace-nowrap p-3">
											<div className=" font-medium text-green-500">
												{item.batch_name}
											</div>
										</td>
										<td className="whitespace-nowrap p-3">
											<div className="">{item.date}</div>
										</td>
										<td className="whitespace-nowrap p-3">
											<div className="text-right my-2 space-x-2">
												<Link
													href={`/result/${item._id}`}
													className="bg-cyan-600 rounded-sm rounded-tr-xl rounded-bl-xl p-3 shadow-lg shadow-cyan-900/80 transition-all active:shadow-none hover:scale-95"
												>
													{" "}
													<div className="pi pi-link"></div>
												</Link>
												<button
													className="bg-rose-600 rounded-sm rounded-tl-xl rounded-br-xl p-3 shadow-lg shadow-rose-900/80 transition-all active:shadow-none hover:scale-90"
													onClick={() => {
														deleteExam(item._id);
													}}
												>
													{" "}
													<div className="pi pi-trash "></div>
												</button>
											</div>
										</td>
									</tr>
								))}
							</Loading>
						</tbody>
					</table>
				</div>
			</main>
		</div>
	);
}

export default Result;
