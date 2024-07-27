"use client";
import axios from "axios";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { useEffect } from "react";

interface Student {
	student_id: string;
	marks: number;
}
interface StudentData {
	_id: string;
	name: string;
	admissionNo: string;
	picture?: string;
}
interface Value {
	subject: string;
	_id: string;
	date: string;
  marks:number;
	students: StudentData[];
}
function page({ params }: { params: { slug: string } }) {
	const { slug } = params;
	const [error, setError] = React.useState(false);
	useEffect(() => {
		axios
			.get(`/api/exam/students?id=${slug}`)
			.then((response) => {
				console.log(response.data.data);
				setValues(response.data.data);
			})
			.catch((error) => {
				console.log(error);
				setError(true);
			});
	}, [slug]);
	useEffect(() => {
		if (error) {
			notFound();
		}
	}, [error]);

	const [students, setStudents] = React.useState<Student[]>([]);
	const [values, setValues] = React.useState<Value>();

	const handleAddStudent = () => {
		const studentInputs =
			document.querySelectorAll<HTMLInputElement>("table input");
		const newStudents: Student[] = [];

		studentInputs.forEach((studentInput, index) => {
			const marksInput = studentInput.value;
			const id = studentInput.id;
			if (studentInput && marksInput) {
				newStudents.push({
					student_id: id,
					marks: Number(marksInput),
				});
			}
		});

		setStudents([...students, ...newStudents]);
	};
	return (
		<>
			<header className="flex items-center justify-between px-4 border-b border-slate-300/50 mb-3 h-14">
				<h2 className="text-3xl font-semibold">{values?.subject}</h2>
        <div className="flex gap-3 items-center">
          <button className="border border-emerald-400 text-emerald-400 rounded-md hover:bg-slate-200/10"><i className="pi pi-save p-3"></i></button>
				<p className="hidden sm:block opacity-75">Assign Date:- {values?.date}</p>
        </div>
			</header>
			<main className="max-h-[calc(100vh-6.5rem)] relative border rounded-3xl sm:p-4 p-2 overflow-auto custom-scrollbar">
				<div className="h-full overflow-auto">
					<table className="table-auto w-full">
						<thead className="font-semibold uppercase text-gray-400 text-lg">
							<tr>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Admission no</div>
								</th>
								<th className="p-2 whitespace-nowrap text-center">
									<div className="font-semibold text-left">Name</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-right">Set Marks</div>
								</th>
							</tr>
						</thead>
						<tbody className="text-sm divide-y divide-gray-100 relative">
							{values?.students?.map((item, index) => (
								<tr key={index} className="p-3 ">
									<td className="whitespace-nowrap p-3">
										<div className=" font-medium text-rose-400">
											{item.admissionNo}
										</div>
									</td>
									<td className="whitespace-nowrap p-3">
										<div className=" font-medium text-left">{item.name}</div>
									</td>
									<td className="whitespace-nowrap p-3">
										<div className="text-right my-2">
											<input type="number" placeholder={values?.marks+""} id={item._id} className="bg-[#393E46] px-3 py-2 rounded-md outline-none focus:outline focus:outline-[#00ADB5]/60" max={values?.marks+""}/>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</main>
		</>
	);
}

export default page;
