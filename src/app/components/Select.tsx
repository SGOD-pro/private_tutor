"use client";
import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
interface SelectProps {
	value: any;
	options: any;
	handleChange: (e: any) => void;
}

function Select({ value, handleChange, options }: SelectProps) {
	return (
		<Dropdown
			value={value}
			onChange={handleChange}
			options={options}
			optionLabel="name"
			placeholder="Select a Batch"
			className="w-full md:w-14rem text-xs bg-[#393E46]"
		/>
	);
}

export default Select;
