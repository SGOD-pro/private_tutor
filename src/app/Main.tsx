"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllBatches } from "@/store/slices/Batch";
import { setSubject } from "@/store/slices/Subjects";

import Navbar from "./components/Navbar";
import ToastComponent from "./components/ToastComponent";
import axios from "axios";

function Main({ children }: { children: React.ReactNode }) {
	const subjects = useSelector((state: any) => state.Subjects.allSubjects);
	const batches = useSelector((state: any) => state.Batches.allBatches);
	const dispatch = useDispatch();

	useEffect(() => {
		if (
			subjects.length === 0
		) {
			axios
				.get("/api/subjects/getsubjects")
				.then((response: any) => {
					dispatch(setSubject(response.data.allSubjects));
				})
				.catch((error: any) => {
					console.log(error);
				});
		}
	}, [subjects, dispatch]);

	useEffect(() => {
		if (batches?.length === 0) {
			axios
				.get("/api/batches/getBatches")
				.then((response) => {
					dispatch(setAllBatches(response.data.allBatches));
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [batches, dispatch]);
const [showNav, setShowNav] = useState(false);

	return (
		<>
			<main className=" flex bg-[#00ADB5] w-screen h-screen overflow-hidden">
				<Navbar show={showNav} setShow={setShowNav}/>
				<ToastComponent />
				<div className={`w-full h-full shadow-left-side sm:rounded-l-3xl md:rounded-l-[4rem] sm:ml-2 p-1 md:p-5 bg-gradient-radial relative z-0 overflow-hidden`}>
					<i className="pi pi-align-left bg-[#00ADB5] rounded-full p-2 mb-3 absolute z-50 top-2 left-2 sm:hidden" onClick={()=>setShowNav(true)}></i>
					{children}
				</div>
			</main>
		</>
	);
}

export default Main;
