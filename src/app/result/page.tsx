"use client";
import React, { useEffect, useState, useCallback } from "react";
import Popover from "../components/Popover";
import ExamForm from "../components/ExamForm";
import Table from "../components/Table";

function Result() {
	const [show, setShow] = useState(false);

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
			<main className="">
				<Table
					columns={[{ field: "subject", header: "Subject" }]}
					values={[]}
				/>
			</main>
		</div>
	);
}

export default Result;
