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
		<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-slate-400/60 rounded-lg p-2">
			{children}
		</div>
	);
}

export default Popover;
