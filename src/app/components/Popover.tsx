"use client";
import React, { memo, useState } from "react";

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
		<div className={`fixed top-1/2 sm:left-[57%] left-1/2 -translate-x-1/2 -translate-y-1/2 border border-slate-400/60 rounded-lg p-2 transition-all duration-300 ${show?'scale-100 visible opacity-100':' scale-50 invisible opacity-0 shadow-none'} z-50 bg-zinc-950/80 backdrop-blur shadow-black shadow-lg sm:min-w-96 min-w-[90vw]`}>
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

export default memo(Popover);
