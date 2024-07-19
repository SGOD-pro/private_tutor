"use client";
import React, { useState, useEffect } from "react";
import Editor from "../components/Editor";
import AddAssignment from "./AddAssignment";
import Loading from "../components/Loading";
import Link from "next/link";
export interface AddAssignmentInterface {
	fileURL: string | null;
	explanation: string | null;
	_id: string;
	subject: string;
	submissionDate: Date;
	issue: Date;
}
function Assignment() {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const handleDOMContentLoaded = () => {
			setLoading(false);
		};
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
		} else {
			handleDOMContentLoaded();
		}

		return () => {
			document.removeEventListener("DOMContentLoaded", handleDOMContentLoaded);
		};
	}, []);
	const [menu, setmenu] = useState(true);
	const menubar = () => {
		setmenu((prev) => !prev);
	};

	return (
		<div className="h-full w-full  overflow-x-hidden overflow-y-auto custom-scrollbar">
			<header className="sticky left-0">
				<div className="flex items-center justify-between border-b-slate-500/60 border-b mb-2 p-1">
					<h2 className="text-3xl font-semibold">Assignments</h2>
					<Link
						href="/all/show-assignments"
						className="text-emerald-400 hover:underline"
					>
						Show Assignments
					</Link>
				</div>
				<div className="md:m-auto bg-slate-800 w-56 rounded-lg p-2">
					<div
						className="flex items-center justify-around p-1 relative rounded-md cursor-pointer overflow-hidden"
						onClick={menubar}
					>
						<div
							className={` absolute w-1/2 h-full left-0 ${
								menu ? "translate-x-0" : "translate-x-full"
							} transition-all`}
						>
							<div className="bg-slate-900 w-full h-full rounded p-2"></div>
						</div>
						<p
							className={`z-10 pointer-events-none ${
								!menu && "text-white/40"
							} selection:pointer-events-none`}
						>
							Text Editor
						</p>
						<p
							className={`z-10 pointer-events-none ${
								menu && "text-white/40"
							} selection:pointer-events-none`}
						>
							Upload file
						</p>
					</div>
				</div>
			</header>
			<section className="h-[80vh] w-[200%] flex relative">
				<Loading loading={loading}>
					<div
						className={`w-full ${
							!menu ? "-translate-x-1/2" : "translate-x-0"
						} transition-all h-full flex`}
					>
						<aside className="w-1/2 h-full">
							<Editor />
						</aside>
						<aside className="w-1/2 h-full">
							<AddAssignment />
						</aside>
					</div>
				</Loading>
			</section>
		</div>
	);
}

export default Assignment;
