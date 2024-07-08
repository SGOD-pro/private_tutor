"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import QueryTable from "../components/QueryTable";
import Loading from "../components/Loading";
import { AppDispatch } from "@/store/store";

import { showToast, ToastInterface } from "@/store/slices/Toast";
import {
	InputNumber,
	InputNumberValueChangeEvent,
} from "primereact/inputnumber";

import axios from "axios";
import Popover from "../components/Popover";
import { useDispatch } from "react-redux";
interface DataInterface {
	fees: number;
	subjects: string;
	admissionNo: string;
}
function Fees() {
	const [data, setData] = useState<DataInterface[]>([]);
	const [byMonth, setByMonth] = useState<DataInterface[]>([]);

	const addDispatch: AppDispatch = useDispatch();

	const Toast = useCallback(({ summary, detail, type }: ToastInterface) => {
		addDispatch(
			showToast({
				severity: type,
				summary,
				detail,
				visible: true,
			})
		);
	}, []);
	const [show, setShow] = useState(false);
	const [show2, setShow2] = useState(false);
	interface PaidMonths {
		[key: string]: number[];
	  }
	const [addDateObj, setAddDateObj] = useState<{
		paid?:PaidMonths;
		year: number;
		monthIndex: number;
	}>({
		year: 0,
		monthIndex: 0,
	});

	const [currentYear, setCurrentYear] = useState<number>(0);
	const ButtonComponent: React.FC<{ id: string }> = ({ id }) => {
		const [disable, setDisable] = useState(false);
		const viewFees = async (id: string) => {
			console.log(id);
			setDisable(true);
			setDateObj({
				year: currentYear,
				monthIndex: currentMonthIndex,
			});
			axios
				.get(`/api/fees?id=${id}`)
				.then((response) => {
					setShow(true);
					console.log(response.data.data);
					
					setAddDateObj({
						year: response.data.data.year,
						monthIndex: response.data.data.month,
						paid: response.data.data.paid
					});
				})
				.catch((error) => {
					Toast({
						summary: "Error",
						type: "error",
						detail:
							error.response.data.message ||
							"Cannot delete! Internal server error",
					});
				})
				.finally(() => {
					setDisable(false);
				});
		};
		return (
			<div className="card flex flex-wrap justify-content-center gap-3">
				<button
					className="rounded-xl bg-gradient-to-tl to-lime-400 shadow-black  from-lime-600 p-3 flex items-center justify-center shadow-md active:scale-95 transition-all active:shadow-none"
					onClick={() => viewFees(id)}
				>
					{!disable ? (
						<i className="pi pi-eye"></i>
					) : (
						<i className="pi pi-spin pi-spinner"></i>
					)}
				</button>
			</div>
		);
	};
	const [months, setMonths] = useState<string[]>([]);
	const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(0);
	const [dateObj, setDateObj] = useState<{ year: number; monthIndex: number }>({
		year: 0,
		monthIndex: 0,
	});

	const initializeMonths = useCallback(() => {
		(function () {
			const monthsArray = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			];
			setMonths(monthsArray);
			const currentDate = new Date();
			const currentMonthIndex = currentDate.getMonth();
			const currentYear = currentDate.getFullYear();
			setCurrentYear(currentYear);
			setCurrentMonthIndex(currentMonthIndex);
			setDateObj({
				year: currentYear,
				monthIndex: currentMonthIndex,
			});
		})();
	}, []);
	useEffect(() => {
		initializeMonths();
		axios
			.get("/api/fees/get-students")
			.then((response) => {
				setData(response.data.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	useEffect(() => {
		if (!show) {
			setAddDateObj({
				year: 0,
				monthIndex: 0,
			});
		}
	}, [show]);

	const [showNav, setShowNav] = useState(false);
	const inputSearch = useRef<HTMLInputElement>(null);
	const [payFee, setPayFee] = useState<{
		name: string;
		month: string;
		_id: string;
	} | null>(null);
	const SearchStudent = useCallback(
		() => {
			const regex = /^CA-\d{2}\/\d{2}-\d+$/;
			if (!inputSearch.current) {
				return;
			}
			const input = inputSearch.current.value;
	
			if (!regex.test(input)) {
				Toast({
					summary: "Invalid input",
					type: "warn",
					detail: "Not a valid admission no",
				});
				return;
			}
			axios
				.get(`/api/fees/get-student?id=${input}`)
				.then((response) => {
					setPayFee(response.data.data);
				})
				.catch((error) => {
					console.log(error);
					Toast({
						summary: "Invalid input",
						type: "error",
						detail: error.response.data.message,
					});
				});
		},
	  [],
	)
	
	const [key, setKey] = useState(0);
	const PayFee = useCallback(
		(id: string) => {
			axios
				.post(`/api/fees?id=${id}`)
				.then((response) => {
					Toast({
						summary: "Paid",
						type: "success",
						detail: response.data.message,
					});
					if (payFee) {
						const tmp = payFee;
						tmp.month = response.data.data;
						console.log(tmp);
						setKey((prev) => prev + 1);
						setPayFee((prev) => ({ ...prev!, month: tmp.month }));
					}
				})
				.catch((error) => {
					Toast({
						summary: "Not paid",
						type: "error",
						detail: error.response.data.message,
					});
				});
		},
	  [],
	)
	
	return (
		<>
			<div className="rounded-l-[44px] relative h-full overflow-hidden">
				<Popover show={show} setShow={setShow}>
					<div className=" rounded mt-2">
						<header className="flex justify-between items-center mb-2">
							<button
								onClick={() => {
									let year = dateObj.year - 1;
									if (year >= addDateObj.year) {
										setDateObj({
											year,
											monthIndex: 11,
										});
									}
								}}
								className="disabled:opacity-40 disabled:cursor-not-allowed"
								disabled={dateObj.year === addDateObj.year}
							>
								<i className="pi pi-angle-left border p-1 px-2 cursor-pointer text-lg rounded pointer-events-none"></i>
							</button>
							<h1 className="font-bold text-xl">{dateObj.year}</h1>
							<button
								onClick={() => {
									let year = dateObj.year + 1;
									if (year < currentYear) {
										setDateObj({
											year,
											monthIndex: 11,
										});
									}
									if (year == currentYear) {
										setDateObj({
											year,
											monthIndex: currentMonthIndex,
										});
									}
								}}
								disabled={dateObj.year === currentYear}
								className=" disabled:opacity-40 disabled:cursor-not-allowed"
							>
								<i className="pi pi-angle-right border p-1 px-2 cursor-pointer text-lg rounded pointer-events-none"></i>
							</button>
						</header>

						<ul className="grid grid-cols-4 gap-2">
							{months.map((month, index) => (
								<li
								key={index}
								className={`grid place-content-center rounded-md p-2 h-14 ${
								  (dateObj.year === addDateObj.year &&
									addDateObj.monthIndex <= index &&
									index <= dateObj.monthIndex) ||
								  (dateObj.year > addDateObj.year && index <= dateObj.monthIndex)
									? addDateObj.paid &&
									  addDateObj.paid[dateObj.year.toString()] &&
									  addDateObj.paid[dateObj.year.toString()].includes(index + 1)
									  ? "bg-emerald-600"
									  : "bg-rose-600"
									: "bg-zinc-500 opacity-60 scale-95"
								}`}
							  >
									<h2 className="text-xl font-bold">{month}</h2>
								</li>
							))}
						</ul>
					</div>
				</Popover>
				<Popover show={show2} setShow={setShow2}>
					<div className=" mt-2">
						<header className="w-full flex gap-2">
							<input
								type="text"
								className="p-2 w-full rounded-md"
								placeholder="CA-24/25-xx"
								ref={inputSearch}
							/>
							<button
								className="border border-amber-500 text-amber-500 rounded-md active:scale-90 transition-all hover:bg-amber-500 hover:text-black"
								onClick={SearchStudent}
							>
								<i className="pi pi-search px-3 py-2 w-full"></i>
							</button>
						</header>
						{payFee && (
							<section className="flex justify-between mt-2 h-14 bg-slate-500/30 p-3 items-center rounded-md">
								<h2 className="text-xl">{payFee.name}</h2>
								<div className="card flex justify-content-center">
									<button
										className="bg-teal-500 text-lg rounded-md px-3 py-1 flex items-center gap-1"
										onClick={() => {
											PayFee(payFee._id);
										}}
										key={key}
									>
										<i className="pi pi-indian-rupee "></i>
										{payFee.month}
									</button>
								</div>
							</section>
						)}
					</div>
				</Popover>

				<header className="flex justify-between items-center border-b h-14 px-3 relative">
					<h2 className="text-2xl font-semibold">Allocate fees</h2>
					<i
						className={`pi pi-angle-right ${
							showNav ? "rotate-90" : "-rotate-90"
						} sm:hidden transition-all`}
						onClick={() => {
							setShowNav((prev) => !prev);
						}}
					></i>
					<div
						className={`z-20 absolute sm:static bottom-0 left-0 translate-y-full bg-stone-900 w-full sm:w-fit rounded-b-3xl shadow-black shadow-md ease-out ${
							showNav ? "h-28" : "h-0"
						} sm:h-fit sm:translate-y-0 sm:bg-transparent overflow-hidden transition-all`}
					>
						<div className="flex items-center gap-2  flex-col sm:flex-row min-w-64 w-3/4 m-auto p-3 sm:p-0">
							<input
								type="text"
								className="rounded-md bg-[#393E46] w-full	outline-none px-3 py-2"
								placeholder="AdmissionNo | ContactNo"
							/>
							<button
								className="sm:bg-cyan-500 text-cyan-500 sm:text-white w-full sm:w-fit border border-cyan-500 rounded-md active:scale-90 transition-all flex items-center justify-center"
								onClick={() => {
									setShow2(true);
								}}
							>
								<p className=" capitalize sm:hidden pointer-events-none">
									pay fee
								</p>
								<i className="pi pi-indian-rupee py-2 px-2 pointer-events-none"></i>
							</button>
						</div>
					</div>
				</header>
				<div className=" relative h-[calc(100vh-5.5rem)] overflow-auto w-full custom-scrollbar">
					<Loading loading={false}>
						<QueryTable
							columns={[
								{ field: "admissionNo", header: "Admission no" },
								{ field: "fees", header: "Fees" },
							]}
							values={data}
							Components={ButtonComponent}
						/>
					</Loading>
				</div>
			</div>
		</>
	);
}

export default Fees;
