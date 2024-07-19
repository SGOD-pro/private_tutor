"use client";
import React, { useState, useCallback, useRef } from "react";
import { AppDispatch } from "@/store/store";
import { showToast, ToastInterface } from "@/store/slices/Toast";
import axios from "axios";
import Popover from "../components/Popover";
import { useDispatch } from "react-redux";
import { extractDate, getNextMonth, monthsDifference } from "@/utils/DateTime";
import Loading from "../components/Loading";
import PaymentForm from "../components/PaymentForm";
import Loader from "../components/Loader";
interface FeesInterface {
	month: string | Date;
	feesDate: string | Date;
}

export interface Student {
	_id: string;
	name: string;
	admissionNo: string;
	fees: number;
	firstPaid: boolean;
	month: Date; // Use `Date` type if you plan to work with Date objects
}
function Fees() {
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
	const [show2, setShow2] = useState(false);
	const [searchLoading, setSearchLoading] = useState(false);

	const validAdmissionNo = useCallback((value: string) => {
		const regex = /^CA-\d{2}\/\d{2}-\d+$/;
		if (!regex.test(value)) {
			Toast({
				summary: "Invalid input",
				type: "warn",
				detail: "Not a valid admission no",
			});
			return false;
		}
		return true;
	}, []);

	const [showNav, setShowNav] = useState(false);
	const inputSearch = useRef<HTMLInputElement>(null);
	const studentSearchBox = useRef<HTMLInputElement>(null);

	const [studentData, setSetstudentData] = useState<Student | null>(null);
	const SearchStudent = useCallback((e:React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!inputSearch.current) {
			return;
		}
		const input = inputSearch.current.value;
		if (!validAdmissionNo(input)) {
			return;
		}
		setSearchLoading(true);
		axios
			.get(`/api/fees/get-student?id=${input}`)
			.then((response) => {
				setSetstudentData(response.data.data);
			})
			.catch((error) => {
				console.log(error);
				Toast({
					summary: "Invalid input",
					type: "error",
					detail: error.response.data.message,
				});
			})
			.finally(() => {
				setSearchLoading(false);
			});
	}, []);

	const [key, setKey] = useState(0);

	const [studentFeesDetails, setStudentFeesDetails] =
		useState<FeesInterface[]>();
	const [loading, setLoading] = useState(false);
	const getStudentDetails = useCallback(() => {
		if (!studentSearchBox.current) {
			return;
		}
		const input = studentSearchBox.current.value;
		if (!validAdmissionNo(input)) {
			return;
		}
		setLoading(true);
		axios
			.get(`/api/fees?id=${input}`)
			.then((response) => {
				const currentDate = new Date();
				let loop = monthsDifference(
					response.data.data.admissionDate,
					currentDate.toISOString()
				);
				const feesPaidDetails = response.data.data.feesPaidDetails;
				if (feesPaidDetails) {
					loop = feesPaidDetails.length > loop ? feesPaidDetails.length : loop;
				}

				const data: FeesInterface[] = [];
				const admissionDate = response.data.data.admissionDate;
				console.log(loop, admissionDate, currentDate);
				data.push({
					month: admissionDate,
					feesDate: Array.isArray(feesPaidDetails) ? feesPaidDetails[0] : null,
				});
				let nM = getNextMonth(admissionDate);
				for (let i = 1; i <= loop; i++) {
					data.push({
						month: nM,
						feesDate: Array.isArray(feesPaidDetails)
							? feesPaidDetails[i]
							: null,
					});
					nM = getNextMonth(nM);
				}
				setStudentFeesDetails(data);
			})
			.catch((error) => {
				console.log(error);

				Toast({
					summary: "Invalid input",
					type: "error",
					detail:
						error.response.data.message ||
						error.message ||
						"Something went wrong",
				});
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<>
			<div className="rounded-l-[44px] relative h-full overflow-hidden">
				<Popover show={show2} setShow={setShow2}>
					<div className=" mt-2">
						<header className="w-full">
							<form action="" onSubmit={SearchStudent} className="w-full flex gap-2">
								<input
									type="text"
									className="p-2 w-full rounded-md outline-none"
									placeholder="CA-24/25-xx"
									ref={inputSearch}
								/>
								<button
									className="border border-amber-500 text-amber-500 rounded-md active:scale-90 transition-all hover:bg-amber-500 hover:text-black"
									type="submit"
								>
									<i className="pi pi-search px-3 py-2 w-full"></i>
								</button>
							</form>
						</header>
						<div className="relative">
							{searchLoading && (
								<div className="absolute top-0 bg-[#0E1014]/50 backdrop-blur z-50 w-full h-full flex items-center justify-center rounded-lg">
									<Loader />
								</div>
							)}
							<PaymentForm data={studentData} />
						</div>
					</div>
				</Popover>

				<header className="flex justify-between items-center border-b h-14 px-3 relative">
					<h2 className="text-2xl font-semibold">Payment details</h2>
					<i
						className={`pi pi-angle-right ${
							showNav ? "rotate-90" : "-rotate-90"
						} sm:hidden transition-all`}
						onClick={() => {
							setShowNav((prev) => !prev);
						}}
					></i>
					<div
						className={`z-20 absolute sm:static bottom-0 left-0 translate-y-full backdrop-blur-md w-full sm:w-fit rounded-b-3xl sm:rounded-none shadow-black shadow-md ease-out ${
							showNav ? "h-28" : "h-0"
						} sm:h-fit sm:translate-y-0 sm:backdrop-blur-none sm:bg-transparent bg-[#101317] overflow-hidden transition-all`}
					>
						<div className="flex items-center gap-2  flex-col sm:flex-row min-w-72 m-auto p-3 sm:p-0">
							<div className="flex gap-2 items-center w-full sm:w-fit">
								<input
									type="text"
									className="rounded-md bg-[#393E46] outline-none px-3 py-2"
									placeholder="AdmissionNo | ContactNo"
									ref={studentSearchBox}
								/>
								<button
									className="sm:bg-green-500 text-green-500 sm:text-white w-full sm:w-fit border border-green-500 rounded-md active:scale-90 transition-all flex items-center justify-center"
									onClick={getStudentDetails}
								>
									<i className="pi pi-search py-2 px-2 pointer-events-none"></i>
								</button>
							</div>
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
					<section className="flex flex-col justify-center antialiased  text-gray-600 p-4">
						<div className="">
							<div className="w-full  mx-auto">
								<div className="p-3">
									<div className="overflow-x-auto">
										<table className="table-auto w-full ">
											<thead className="font-semibold uppercase text-gray-400 text-xl ">
												<tr>
													<th className="p-2 whitespace-nowrap">
														<div className="font-semibold text-left">
															Months
														</div>
													</th>
													<th className="p-2 whitespace-nowrap">
														<div className="font-semibold text-center text-xl">
															Paid date
														</div>
													</th>
												</tr>
											</thead>
											<tbody className="text-sm divide-y divide-gray-100 relative">
												<Loading loading={loading}>
													{studentFeesDetails?.map((item, index) => (
														<tr key={index}>
															<td className="p-2 whitespace-nowrap text-lg">
																<div className="text-left">
																	{extractDate(item.month)}
																</div>
															</td>
															<td className="p-2 whitespace-nowrap text-lg">
																<div className="text-center font-medium text-green-500">
																	{item.feesDate ? (
																		extractDate(item.feesDate)
																	) : (
																		<>
																			<span className="text-rose-500">- -</span>
																		</>
																	)}
																</div>
															</td>
														</tr>
													))}
												</Loading>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}

export default Fees;
