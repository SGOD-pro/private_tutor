import React from "react";

function Button({ disable }: { disable: boolean }) {
	return (
		<div className=" text-right mt-3">
			<button
				className={`px-3 py-1 text-lg rounded-md bg-[#393E46] ${
					disable && "grayscale-[50%] cursor-not-allowed"
				}`}
				disabled={disable}
			>
				Add
				{disable && <i className="pi pi-spin pi-spinner ml-2"></i>}
			</button>
		</div>
	);
}

export default Button;
