"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllBatches } from "@/store/slices/SubjectBatch";
import { setSubject } from "@/store/slices/Subjects";

import Navbar from "./components/Navbar";
import ToastComponent from "./components/ToastComponent";
import axios from "axios";
import Offline from "./components/Offline";

function Main({ children }: { children: React.ReactNode }) {
	const subjects = useSelector((state: any) => state.Subjects.allSubjects);
	const batches = useSelector((state: any) => state.Batches.allBatches);
	const dispatch = useDispatch();
	const fetchSubjectsAndBatches = async () => {
		try {
			const [subjectsResponse, batchesResponse] = await Promise.all([
				subjects.length === 0 && axios.get("/api/subjects/getsubjects"),
				batches?.length === 0 && axios.get("/api/batches/getBatches"),
			]);

			if (subjectsResponse) {
				dispatch(setSubject(subjectsResponse.data.allSubjects));
			}

			if (batchesResponse) {
				dispatch(setAllBatches(batchesResponse.data.allBatches));
			}
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		fetchSubjectsAndBatches();
	}, [subjects, batches, dispatch]);
	const [showNav, setShowNav] = useState(false);
	const showNavFunc = useCallback((e: MouseEvent) => {
		if ((e.target as HTMLElement).id !== "show-nav-icon") {
			setShowNav(false);
		}
	}, []);

	useEffect(() => {
		document.addEventListener("click", showNavFunc);
		return () => {
			document.removeEventListener("click", showNavFunc);
		};
	}, []);
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
	  if (typeof window !== 'undefined') {
		setIsOnline(navigator.onLine);
  
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);
  
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);
  
		return () => {
		  window.removeEventListener('online', handleOnline);
		  window.removeEventListener('offline', handleOffline);
		};
	  }
	}, []);
	return (
		<>
			<main className=" flex bg-[#00ADB5] w-screen h-screen overflow-auto">
				{!isOnline&&<div className="absolute left-0 top-0  w-full h-full z-[1000]">
					<Offline />
				</div>}
				<Navbar show={showNav} setShow={setShowNav} />
				<ToastComponent />
				<div
					className={`w-full h-full shadow-left-side sm:rounded-l-3xl md:rounded-l-[4rem] sm:ml-2 p-1 md:p-5 bg-gradient-radial relative z-0 overflow-hidden `}
				>
					<i
						className="pi pi-align-left bg-[#00ADB5] opacity-50 hover:opacity-100 rounded-full p-2 mb-3 absolute z-50 top-2 left-2 sm:hidden"
						id="show-nav-icon"
						onClick={() => setShowNav(true)}
					></i>
					{children}
				</div>
			</main>
		</>
	);
}

export default Main;
``;
