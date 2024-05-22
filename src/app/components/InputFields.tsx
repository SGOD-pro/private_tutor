import React, { ChangeEvent } from "react";

interface InputFieldsProps {
	name?: string;
	type?: string;
	value: any;
	setValue: React.Dispatch<React.SetStateAction<any>>;
	readOnly?: boolean;
	placeholder?: string;
}

function InputFields({
	name,
	type = "text",
	value,
	setValue,
	readOnly = false,
	placeholder,
}: InputFieldsProps) {
	const handleChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const {
			name: fieldName,
			value: fieldValue,
			type: fieldType,
		} = event.target;
		const files =
			fieldType === "file" ? (event.target as HTMLInputElement).files : null;
		if (fieldType === "file" && files) {
			setValue((prevState: any) => ({
				...prevState,
				[fieldName]: files[0],
			}));
		} else {
			setValue((prevState: any) => ({
				...prevState,
				[fieldName]: fieldValue,
			}));
		}
	};

	return (
		<div className="flex flex-wrap w-full mb-2 md:mb-3">
			<label
				htmlFor={name}
				className="flex-grow flex-shrink basis-24 capitalize"
			>
				{name}
			</label>
			<input
				type={type}
				name={name}
				value={value}
				onChange={handleChange}
				className="flex-grow flex-shrink basis-44 rounded-md px-2 py-2 bg-[#393E46] focus:outline outline-[3px] outline-teal-500/30 transition-all"
				readOnly={readOnly}
				placeholder={placeholder || ""}
			/>
		</div>
	);
}

export default InputFields;
