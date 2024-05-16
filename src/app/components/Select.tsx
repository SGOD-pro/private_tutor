"use client";
import React, { useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
interface SelectProps {
	values: any;
	setValues: React.Dispatch<React.SetStateAction<any>>;
}

function Select({ values, setValues }: SelectProps) {
	let batches = useSelector((state: any) => state.Batches.allBatches);
	batches = batches.map((item: any) => ({
		name: item.batchName,
	}));
	return (
		<Dropdown
			value={values.batch}
			onChange={(e) => setValues((prev: any) => ({ ...prev, batch: e.value }))}
			options={batches}
			optionLabel="name"
			placeholder="Select a Batch"
			className="w-full md:w-14rem text-xs bg-[#393E46]"
		/>
	);
}

export default Select;
