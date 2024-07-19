import React, { useRef, useState, useCallback } from "react";
import SelectCom from "./SelectCom";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { ToastInterface } from "@/store/slices/Toast";
import { showToast } from "@/store/slices/Toast";
import { Nullable } from "primereact/ts-helpers";
import { pushAssignment } from "@/store/slices/Assignments";

function AddAssignment() {
	const batchid = useRef<string | null>(null);
	const subDate = useRef<Nullable<Date>>(new Date());

	const [loading, setloading] = useState(false);
	const [file, setFile] = useState<File | null>();
	const appDispatch: AppDispatch = useDispatch();
	const show = ({ summary, detail, type }: ToastInterface) => {
		appDispatch(
			showToast({
				severity: type,
				summary,
				detail,
				visible: true,
			})
		);
	};
	const submit = useCallback((e: React.FocusEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(batchid.current);
		
		if (!batchid.current) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "Select Batch",
			});
			return;
		}
		setloading(true);

		axios
			.post(
				"/api/assignment",
				{
					fileUrl: file,
					batch: batchid.current,
					submissionDate: subDate.current,
				},
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			)
			.then((response) => {
				pushAssignment(response.data.data);

				show({
					summary: "Added successfuly",
					type: "success",
					detail: response.data.message || "Assignment added",
				});
			})
			.catch((error) => {
				show({
					summary: "Error",
					type: "error",
					detail: error.response.data.message || "Internal server error",
				});
			})
			.finally(() => {
				setloading(false);
				batchid.current = null;
				subDate.current=null;
			});
	}, [subDate,batchid]);

	return (
		<form
			action=""
			className="m-auto border w-full md:w-3/4 lg:w-1/2 p-3 mt-4 border-dashed rounded-lg overflow-x-auto"
			onSubmit={submit}
		>
			<div className="card flex justify-content-center mb-3">
				<FileUpload
					mode="basic"
					name="demo[]"
					accept="image/*"
					maxFileSize={1000000}
					onSelect={(e: FileUploadSelectEvent) => {
						setFile(e.files[0]);
					}}
				/>
			</div>
			<div className="flex gap-3 items-stretch justify-end flex-wrap sticky left-0">
				<SelectCom batchId={batchid} subDate={subDate} />
				<button className="font-semibold border border-emerald-500 text-emerald-500 hover:bg-slate-200/10 rounded-xl shadow shadow-black basis-12">
					{!loading ? (
						<i className="pi pi-cloud-upload px-3 py-3"></i>
					) : (
						<i className="pi pi-spin pi-spinner px-3 py-3"></i>
					)}
				</button>
			</div>
		</form>
	);
}

export default AddAssignment;
