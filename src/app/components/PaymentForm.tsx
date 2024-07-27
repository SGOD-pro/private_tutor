import {
	InputNumber,
	InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { AppDispatch } from "@/store/store";
import Script from "next/script";
import React, { useState, useCallback, memo, useEffect } from "react";
import axios from "axios";
import { showToast, ToastInterface } from "@/store/slices/Toast";
import { useDispatch } from "react-redux";
import { Student } from "@/app/fees/page";
import {
	extractDate,
	getFeesMonthNames,
	monthsDifference,
} from "@/utils/DateTime";
import { Calendar } from "primereact/calendar";

function PaymentForm({ data }: { data: Student | null }) {
	const [values, setValues] = useState(data);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setValues(data);
	}, [data]);

	const appDispatch: AppDispatch = useDispatch();
	const [value, setValue] = useState<number>(1);
	const Toast = useCallback(({ summary, detail, type }: ToastInterface) => {
		appDispatch(
			showToast({
				severity: type,
				summary,
				detail,
				visible: true,
			})
		);
	}, []);
	const [months, setMonths] = useState<string>("");
	const PayFee = useCallback((e: React.FocusEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(values);
		
		if (!values?._id) {
			Toast({
				summary: "Paid",
				type: "success",
				detail: "returned",
			});
			return;
		}
		setLoading(true);
		console.log(value);
		
		axios
			.post(`/api/fees?id=${values?._id}&months=${value}`)
			.then((response) => {
				Toast({
					summary: "Paid",
					type: "success",
					detail: response.data.message,
				});
			})
			.catch((error) => {
				Toast({
					summary: "Not paid",
					type: "error",
					detail: error.response.data.message,
				});
			})
			.finally(() => {
				setValues(null);
				setLoading(false);
			});
	}, [values,value]);
	useEffect(() => {
		setValue(1);
	}, [values?.admissionNo]);
	useEffect(() => {
		if (!values?.month) {
			return;
		}
		setMonths(getFeesMonthNames(values.month, value));
	}, [values?.month, value]);
	const calculateNextMonthDate = useCallback((value: Date | string) => {
		if (value) {
			const nextMonth = new Date(value);
			nextMonth.setMonth(nextMonth.getMonth() - 1);
			return extractDate(nextMonth);
		}
		return "";
	}, []);
	return (
		<section className=" antialiased bg-gray-900 md:py-3 mt-4 rounded-lg relative overflow-hidden">
			<div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
				<div className="mx-auto max-w-5xl">
					<h2 className="text-xl font-semibold text-white sm:text-2xl">
						Payment
					</h2>
					<div className="mt-2 sm:mt-3 w-full">
						<form
							className="w-full rounded-lg border p-3 shadow-sm  border-gray-700  bg-gray-800 sm:p-4 lg:p-5"
							onSubmit={PayFee}
						>
							<div className="mb-6 grid grid-cols-2 gap-4">
								<div className="col-span-2 sm:col-span-1">
									<label
										htmlFor="full_name"
										className="mb-2 block text-sm font-medium text-white"
									>
										Full name
									</label>
									<input
										type="text"
										id="full_name"
										className="block w-full rounded-lg border   p-2.5 text-sm  focus:border-primary-500 focus:ring-primary-500  border-gray-600  bg-gray-700  text-white  placeholder:text-gray-400  focus:border-primary-500  focus:ring-primary-500"
										value={values?.name||""}
										required
										readOnly
										disabled
									/>
								</div>

								<div className="col-span-2 sm:col-span-1">
									<label
										htmlFor="card-number-input"
										className="mb-2 block text-sm font-medium text-white"
									>
										Admission no
									</label>
									<input
										type="text"
										id="card-number-input"
										className="block w-full rounded-lg border   p-2.5 pe-10 text-sm  focus:border-primary-500 focus:ring-primary-500 border-gray-600  bg-gray-700  text-white  placeholder:text-gray-400  focus:border-primary-500  focus:ring-primary-500"
										value={values?.admissionNo||""}
										disabled
										required
										readOnly
									/>
								</div>

								<div className="col-span-2 sm:col-span-1 ">
									<label
										htmlFor="card-number-input"
										className="mb-2 capitalize block text-sm font-medium text-white"
									>
										no of months
									</label>
									<div className="card  justify-content-center w-full">
										<InputNumber
											value={value}
											onValueChange={(e: InputNumberValueChangeEvent) =>
												setValue(e.value ?? 0)
											}
											min={1}
											max={8}
											style={{ width: "100%" }}
											showButtons
											inputClassName="w-10 text-center outline-none"
											buttonLayout="horizontal"
											decrementButtonClassName="p-button-secondary bg-rose-500"
											incrementButtonClassName="p-button-secondary bg-emerald-500"
											incrementButtonIcon="pi pi-plus"
											decrementButtonIcon="pi pi-minus"
											disabled={!values || values?.fees === 0}
										/>
									</div>
								</div>
								<div className="col-span-2 sm:col-span-1">
									<label
										htmlFor="card-number-input"
										className="mb-2 block text-sm font-medium text-white capitalize"
									>
										Assign Date
									</label>
									{/* <input
										type="text"
										id="card-number-input"
										className="block w-full rounded-lg border   p-2.5 pe-10 text-sm  focus:border-primary-500 focus:ring-primary-500 border-gray-600  bg-gray-700  text-white  placeholder:text-gray-400  focus:border-primary-500  focus:ring-primary-500"
										value={
											!values?.firstPaid ?values?.month ? calculateNextMonthDate(values.month) : "":extractDate(values.month)
										}
										required
									/> */}
									<Calendar className="w-full" disabled={!values || values?.fees === 0}/>
								</div>
							</div>

							<button
								type="submit"
								className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300  bg-primary-600  hover:bg-primary-700  focus:ring-primary-800 bg-blue-500 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-[#111827]"
								disabled={values?.fees === 0 || loading}
							>
								Pay now
								{loading && <i className="pi pi-spin pi-spinner ml-3"></i>}
							</button>
						</form>

						<div className="grow sm:mt-4 lg:mt-0 min-w-72">
							<div className="space-y-4 mt-4 rounded-lg border p-4 border-gray-700  bg-gray-800">
								<div className="space-y-1">
									<dl className="flex items-center justify-between gap-4">
										<dt className="text-base font-normal  text-gray-400">
											Due
										</dt>
										<dd className="text-base font-medium text-white">
											<i className="pi pi-indian-rupee"></i>
											{values?.month &&
												monthsDifference(new Date(), values.month) *
													values.fees}
										</dd>
									</dl>
									<dl className="flex items-center justify-between gap-4">
										<dt className="text-base font-normal  text-gray-400">
											Fees
										</dt>
										<dd className="text-base font-medium text-white">
											<i className="pi pi-indian-rupee"></i>
											{values?.fees}
										</dd>
									</dl>
									<dl className="flex items-center justify-between gap-4">
										<dt className="text-base font-normal  text-gray-400">
											No of Month
										</dt>
										<dd className="text-base font-medium text-rose-500">
											x{value}
										</dd>
									</dl>
									<dl className="flex items-center justify-between gap-4">
										<dt className="text-base font-normal  text-gray-400">
											Current date
										</dt>
										<dd className="text-base font-medium">
											{extractDate(new Date())}
										</dd>
									</dl>
									<dl className="flex items-center justify-between gap-4">
										<dt className="text-base font-normal  text-gray-400">
											Month
										</dt>
										<dd className="text-base text-right font-medium text-green-500 w-72">
											{months}
										</dd>
									</dl>
								</div>

								<dl className="flex items-center justify-between gap-4 border-t pt-2  border-gray-700">
									<dt className="text-base font-bold text-white">Total</dt>
									<dd className="text-base font-bold text-white">
										<i className="pi pi-indian-rupee"></i>{" "}
										{values?.fees && values.fees * value}
									</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Script
				type="module"
				src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/datepicker.min.js"
			/>
		</section>
	);
}

export default memo(PaymentForm);
