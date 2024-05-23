"use client";

import React, { useEffect, useState } from "react";
import QueryTable from "../components/QueryTable";
import SetStudentBatch from "../components/SetStudentBatch";
import { AppDispatch } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/store/slices/Toast";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../components/Loader";
import { setAllStudentsByBatch,addStudentsToBatch } from "@/store/slices/BatchStudents";
import { RootState } from "@/store/store";
interface StudentDetails {
	addmissionNo: string;
	name: string;
	subjects: string;
}
interface toast {
	summary: string;
	detail: string;
	type: string;
}
interface Batch {
	_id: string;
	subject: string;
	days: string[];
}
export interface ComponentProps {
	id: string;
	subjectWiseBatches: Batch[][] | any;
	subjects: string;
}

function page() {
	const [loading, setLoading] = useState(true);
	const addDispatch: AppDispatch = useDispatch();
	const dispatch = useDispatch();
	const show = ({ summary, detail, type }: toast) => {
		addDispatch(
			showToast({
				severity: type,
				summary,
				detail,
				visible: true,
			})
		);
	};

	interface SubjectObject {
		[key: string]: { code: string; name: string }[];
	}
	const [batchDetails, setBatchDetails] = useState<SubjectObject>({});
	function constructObject(data: { subjectWiseBatches: Batch[][] }): void {
		const result: SubjectObject = {};

		data.subjectWiseBatches.forEach((batchArray) => {
			batchArray.forEach((batch) => {
				const { _id, subject, days } = batch;
				if (!result.hasOwnProperty(subject)) {
					result[subject] = [];
				}
				result[subject].push({ name: _id, code: days.join(",") });
			});
		});
		setBatchDetails(result);
	}
	const [subjects, setSubjects] = useState<string[]>([]);
	const [showForm, setShowForm] = useState<boolean>(false);
	const onClickBtn = (
		id: string,
		subjectWiseBatches: Batch[][] | any,
		subjects: string
	) => {
		console.log(id, subjectWiseBatches);

		localStorage.setItem("id", id);
		constructObject({ subjectWiseBatches });
		console.log(subjects);
		const s = subjects?.split(",");
		setSubjects(s);
		setShowForm(true);
	};
	const [skip, setSkip] = useState(0);
	const [limit, setLimit] = useState(20);
	const [hasMore, setHasMore] = useState(true);
	const data = useSelector(
		(state: RootState) => state.BatchStudents.allStudentsByBatch
	);
	const fetchData = async () => {
		if (data.length !== 0) {
			return;
		}
		axios
			.get(`/api/students/get-all-students?skip=${skip}&limit=${limit}`)
			.then((response) => {
				console.log(response.data.data);

				if (response.data.data.length === 0) {
					setHasMore(false);
				}
				if (skip === 0) {
					dispatch(setAllStudentsByBatch(response.data.data));
				} else {
					dispatch(addStudentsToBatch(response.data.data));
				}
				if (skip === 0) {
					show({
						type: "success",
						summary: "Fetched",
						detail: response.data.message,
					});
				}
			})
			.catch((errror) => {
				if (skip === 0) {
					show({
						type: "error",
						summary: "Error",
						detail: errror.response?.data?.message||"An error occurred.",
					});
				}
			})
			.finally(() => {
				if (skip === 0) {
					setLoading(false);
				}
			});
	};
	const fetchMoreData = () => {
		setSkip(limit);
		setLimit((prev) => prev + 20);
		fetchData();
	};
	useEffect(() => {
		localStorage.clear();
		fetchData();
	}, []);
	const [key1, setKey1] = useState(0);
	useEffect(() => {
		setKey1((prev) => prev + 1);
	}, [batchDetails]);

	const ButtonComponent: React.FC<ComponentProps> = ({
		id,
		subjectWiseBatches,
		subjects,
	}) => {
		return (
			<div className="card flex flex-wrap justify-content-center gap-3">
				<button
					className="rounded-lg bg-gradient-to-tl to-emerald-400 from-emerald-600 p-3 flex items-center justify-center"
					onClick={() => onClickBtn(id, subjectWiseBatches, subjects)}
				>
					<i className="pi pi-plus"></i>
				</button>
			</div>
		);
	};

	return (
		<>
			<div
				className={`absolute z-50 backdrop-blur-md w-[90%] md:w-1/2 top-1/2 left-1/2 -translate-x-1/2 transition-all -translate-y-1/2 duration-300  ${
					showForm
						? " scale-100 opacity-1 visible"
						: "invisible opacity-0 scale-90"
				}`}
			>
				<SetStudentBatch
					batchProps={batchDetails}
					key={key1}
					subjects={subjects}
					closeBtn={setShowForm}
				/>
			</div>
			<div className="h-full rounded-l-[3.2rem] overflow-hidden bg-[#1F2937]">
				<div className="h-full overflow-auto custom-scrollbar relative scrollableDiv">
					<h2 className="text-3xl p-3 pl-8 font-semibold sticky top-0 z-30 bg-[#1F2937]/10 backdrop-blur border-b border-b-[#131921]/60">
						BatchStudents
					</h2>
					{loading ? (
						<div
							className={`absolute w-full h-[92%] animate-pulse z-10 bg-[#393E46]/70 `}
						></div>
					) : (
						<div className="">
							<InfiniteScroll
								dataLength={data.length}
								next={fetchMoreData}
								hasMore={hasMore}
								loader={<Loader />}
								endMessage={
									<p style={{ textAlign: "center" }}>
										<b>You have seen it all</b>
									</p>
								}
								scrollableTarget="scrollableDiv"
							>
								<QueryTable
									columns={[
										{ field: "admissionNo", header: "Admission ID" },
										{ field: "name", header: "Name" },
										{ field: "subjects", header: "Subjects" },
									]}
									values={data}
									Components={ButtonComponent}
								/>
							</InfiniteScroll>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default page;
