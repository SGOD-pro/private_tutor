import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { DropdownChangeEvent } from "primereact/dropdown";

import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import Select from "../components/Select";

interface BatchInterface {
	code: string;
	name: string;
}

interface SubjectInterface {
	_id: string;
	subject: string;
}

interface BatchDetails {
	_id: string;
	subject: string;
	days: string;
	time: string;
}

interface RootState {
	Subjects: { allSubjects: SubjectInterface[] };
	Batches: { allBatches: BatchDetails[] };
}

interface SelectComProps {
	batchId: React.MutableRefObject<string | null>;
	subDate: React.MutableRefObject<Nullable<Date>>;
}

const SelectCom: React.FC<SelectComProps> = ({ batchId, subDate }) => {
	const subjects = useSelector(
		(state: RootState) => state.Subjects.allSubjects
	).map((subject) => ({
		name: subject.subject,
		code: subject._id,
	}));

	const batches = useSelector((state: RootState) => state.Batches.allBatches);

	const [batchValues, setBatchValues] = useState<BatchInterface[]>([]);
	const [selectedSubject, setSelectedSubject] = useState<BatchInterface | null>(
		null
	);
	const [batch, setBatch] = useState<BatchInterface | null>(null);

	const handleSubjectChange = useCallback(
		(e: DropdownChangeEvent) => {
			const selectedSubject = e.value;
			setSelectedSubject(selectedSubject);

			const filteredBatches = batches
				.filter((batch) => batch.subject === selectedSubject.name)
				.map((batch) => ({
					name: `${batch.days} (${batch.time})`,
					code: batch._id,
				}));

			setBatchValues(filteredBatches);
		},
		[batches]
	);

	const handleBatchChange = (e: DropdownChangeEvent) => {
		const selectedBatch = e.value;
		setBatch(selectedBatch);
		batchId.current = selectedBatch.code;
	};

	let today = new Date();
	let month = today.getMonth();
	let year = today.getFullYear();
	let nextMonth = month === 11 ? 0 : month + 2;

	const [date, setDate] = useState<Nullable<Date>>(null);

	let minDate = new Date();

	minDate.setMonth(month);
	minDate.setFullYear(year);

	let maxDate = new Date();

	maxDate.setMonth(nextMonth);
	maxDate.setFullYear(year);
	return (
		<div className="flex gap-3 w-full flex-wrap">
			<div className="card flex justify-content-center grow">
				<Select
					options={subjects}
					handleChange={handleSubjectChange}
					value={selectedSubject}
					placeholder="Subject"
				/>
			</div>
			<div className="card flex justify-content-center grow">
				<Select
					options={batchValues}
					handleChange={handleBatchChange}
					value={batch}
					placeholder="Select Batch"
				/>
			</div>
			<div className="card flex justify-content-center grow">
				<Calendar
					value={date}
					onChange={(e) => {
						setDate(e.value);
						subDate.current = e.value;
					}}
					minDate={minDate}
					maxDate={maxDate}
					readOnlyInput
					placeholder="Subbmission date"
					className="w-full"
				/>
			</div>
		</div>
	);
};

export default SelectCom;
