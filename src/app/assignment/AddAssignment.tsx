import React, { useRef, useState, useCallback } from "react";
import SelectCom from "./SelectCom";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";

function AddAssignment() {
	const batchid = useRef<string | null>(null);
	const [file, setFile] = useState<File | null>();
	const submit = useCallback((e: React.FocusEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(file);
	}, []);

	return (
		<form
			action=""
			className="m-auto border w-full md:w-3/4 lg:w-1/2 p-3 mt-4 border-dashed rounded-lg"
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
			<div className="flex gap-3 items-stretch justify-end">
				<SelectCom batchId={batchid} />
				<button className='font-semibold border border-emerald-500 text-emerald-500 hover:bg-slate-200/10 rounded-xl shadow shadow-black'>
					<i className="pi pi-cloud-upload px-3 text-sm py-1"></i>
					</button>	
			</div>
		</form>
	);
}

export default AddAssignment;
