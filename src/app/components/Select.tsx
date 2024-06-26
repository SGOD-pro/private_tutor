"use client";
import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
interface SelectProps {
	value: any;
	options: any;
	handleChange: (e: any) => void;
	placeholder?:string
}

function Select({ value, handleChange, options,placeholder
 }: SelectProps) {
	return (
		<Dropdown
			value={value}
			onChange={handleChange}
			options={options}
			optionLabel="name"
			placeholder={`${placeholder}`}
			className="w-full bg-[#393E46] p-0 text-sm"
		/>
	);
}

export default Select;
