import React, { useState } from "react";
import InputFields from "./InputFields";
import axios from "axios";
import { useDispatch } from "react-redux";
import {pushSubject} from "@/store/slices/Subjects"


function AddSubject() {
	const [subject, setSubject] = useState({
		subject: "",
	});
	const dispatch=useDispatch()
	const [disable, setDisable] = useState(false)
	
	const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (subject.subject === "") {
			return
		}
		setDisable(true)
		axios.post("/api/subjects/setsubjects", subject)
		.then((response:any) => {
			console.log(response.data);
			setSubject({
				subject: "",
			})
			dispatch(pushSubject(response.data.createdSub))
		})
		.catch((err) =>{console.log(err);
		})
		.finally(() => {setDisable(false)});
	};
	return (
		<form className="w-full h-full" onSubmit={handelSubmit}>
			<InputFields
				name={"subject"}
				value={subject.subject}
				setValue={setSubject}
			/>

			<div className=" text-right">
				<button className={`px-3 py-1 text-lg rounded-md bg-[#393E46] ${disable&&"grayscale-[50%] cursor-not-allowed"}`} disabled={disable}>
					Add
					{disable && <i className="pi pi-spin pi-spinner"></i>}

				</button>
			</div>
		</form>
	);
}

export default AddSubject;
