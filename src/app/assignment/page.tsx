"use client"
import React, { useState } from "react";
import ExamForm from "../components/ExamForm";
import Table from "../components/Table";
import AddAssignment from "./AddAssignment";
function page() {
	const [loading, setLoading] = useState(false)
	return (
		<div className=" w-full h-full flex flex-wrap gap-4">
			<div className="flex-grow flex-shrink basis-80 gap-3 flex flex-col">
				<div className=" h-1/2 border border-[#eee]/60 rounded-lg rounded-tl-[3rem] p-4">
					<h2 className="text-2xl font-semibold">Add Exam</h2>
					<ExamForm />
				</div>

				<div className=" h-1/2 border border-[#eee]/60 rounded-lg rounded-bl-[3rem] p-4 pt-1">
					<h2 className="text-2xl mb-2 font-semibold">Add Assigmnent</h2>
					<AddAssignment />
				</div>
			</div>
			<div className="flex-grow flex-shrink basis-80 gap-3 flex flex-col">
			<div className=" rounded-md md:rounded-lg border border-[#EEEEEE]/60  md:h-full h-[60%] overflow-auto  relative custom-scrollbar">
					{loading ? (
						<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 "></div>
					) : (
						<div className="w-full h-full relative">
							<h2 className="text-xl capitalize p-2 font-semibold sticky top-0 z-10 bg-[#393E46]">
								recent exams
							</h2>
							<Table/>
						</div>
					)}
				</div>

				<div className=" rounded-md md:rounded-lg border border-[#EEEEEE]/60 m md:h-full h-[60%] overflow-auto  relative custom-scrollbar">
					{loading ? (
						<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 "></div>
					) : (
						<div className="w-full h-full relative">
							<h2 className="text-xl capitalize p-2 font-semibold sticky top-0 z-10 bg-[#393E46]">
								recent assignments
							</h2>
							<Table
								
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default page;
