"use client";
import React, { useState } from "react";

function Popover({
	children,
	show,
	setShow,
}: {
	children: React.ReactNode;
	show: boolean;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<div className={`fixed top-1/2 left-[57%] -translate-x-1/2 -translate-y-1/2 border border-slate-400/60 rounded-lg p-2 transition-all duration-300 ${show?'scale-100 visible opacity-100':' scale-50 invisible opacity-0'} z-50 bg-slate-900 shadow-lg min-w-96`}>
			<div className="text-right">
				<i
					className="pi pi-times border p-2 border-slate-500/60 rounded-lg cursor-pointer	"
					onClick={() => {
						setShow(false);
						localStorage.clear();
					}}
				></i>
			</div>
			{children}
		</div>
	);
}

export default Popover;
