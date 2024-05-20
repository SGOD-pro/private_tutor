"use client";
import React, { useState } from "react";
import Table from "../components/Table";
import AddAssignment from "./AddAssignment";
function page() {
	const [loading, setLoading] = useState(false);
	const deleteFunction=(id:string)=>{

	}
	const editFunction=(id:string)=>{

	}
	return (
		<div className="w-full h-full flex flex-wrap gap-3 overflow-auto">
			<div className="w-1/2 flex-grow flex-shrink basis-96 lg:max-w-[480px] ">
				<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 hidden"></div>
				<div className="rounded-md md:rounded-lg border border-[#EEEEEE]/60 md:rounded-tl-[2.5rem] rounded-tl-2xl  overflow-hidden relative p-3">
					<div
						className={`absolute top-0 left-0 w-full h-full animate-pulse z-10 bg-[#393E46]/70 ${
							loading ? "block" : "hidden"
						}`}
					></div>

					<div
						className={`w-full h-full p-1 ${
							loading ? "opacity-0" : "opacity-100"
						}`}
					>
						<h2 className="text-2xl my-1 capitalize font-semibold">
							Add assignments
						</h2>
						<AddAssignment />
					</div>
				</div>

				
			</div>

			<div className="w-1/2 flex-grow flex-shrink basis-96 overflow-hidden rounded-md border border-[#EEEEEE]/60 backdrop-blur h-full">
				{loading ? (
					<div className="absolute w-full h-full animate-pulse z-10 bg-[#393E46]/70 "></div>
				) : (
					<div className="w-full h-full relative overflow-auto custom-scrollbar bg-[#1F2937]">
						<h2 className="text-xl capitalize p-2 font-semibold sticky top-0 z-10 bg-[#393E46]">
							Recent Assignments
						</h2>
						{/* <Table
							columns={["Subject","Batch time","Topic",Submission Date]}
							values={batches}
							deleteFunction={deleteFunction}
							editFunction={editFunction}
						/> */}
					</div>
				)}
			</div>
		</div>
	);
}

export default page;
