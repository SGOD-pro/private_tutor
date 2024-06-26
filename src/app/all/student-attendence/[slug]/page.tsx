"use client";

import Table from "@/app/components/Table";
import Select from "@/app/components/Select";
import axios from "axios";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "@/app/components/Loading";

function ShowAttendence({ params }: { params: { slug: string } }) {
	const [subjects, setSubjects] = useState();
	const [loading, setLoading] = useState<boolean>(false);
	const [subjectsOptions, setSubjectsOptions] = useState<any[] | null>([]);
	const [byPresent, setByPesent] = useState<boolean>(true);
	const [data, setData] = useState<any[] | null>(null);
	const [stdData, setStdData] = useState<any>();
	useEffect(() => {
		if (!params) {
			//notFound();
		}
		const { slug } = params;
		axios.get(`/api/attendence/get-student?id=${slug}`).then((response) => {
			setStdData(response.data.student);
			console.log(response.data);
			
		}).catch(error => {
			console.log(error);
			//notFound();
			
		});
	}, []);

	return (
		<>
			<header className=" flex justify-between items-center p-3 py-2">
				<h2 className="text-xl font-semibold capitalize">{stdData?.name}</h2>
				<div className=" flex gap-4 items-center">
					<Select
						value={subjects}
						handleChange={(e) => {
							setSubjects(e.value);
						}}
						options={subjectsOptions}
						placeholder="Select subject"
					/>
					<div className="flex items-center w-64 gap-3">
						<label htmlFor="" className=" capitalize">
							by present
						</label>
						<InputSwitch
							checked={byPresent}
							onChange={(e: InputSwitchChangeEvent) => setByPesent(e.value)}
						/>
					</div>
				</div>
			</header>
			<div className="">
				<Loading loading={loading}>
					<Table
						columns={[
							{ header: "Subject", field: "subject" },
							{ header: "Date", field: "date" },
						]}
						values={data}
					/>
				</Loading>
			</div>
		</>
	);
}

export default ShowAttendence;
