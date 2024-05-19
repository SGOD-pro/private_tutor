"use client";
import React from "react";
import Icon from "../components/Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
	const pathname = usePathname();
	const links = [
		{
			pathname: "Home",
			route: "/",
			icon: "https://cdn.lordicon.com/xzalkbkz.json",
		},
		{
			pathname: "Batches",
			route: "/manageBatch",
			icon: "https://cdn.lordicon.com/wzwygmng.json",
		},
		{
			pathname: "Days & Time",
			route: "/days",
			icon: "https://cdn.lordicon.com/qvyppzqz.json",
		},
		{
			pathname: "Attendence",
			route: "/attendence",
			icon: "https://cdn.lordicon.com/ozmbktct.json",
		},
		{
			pathname: "Assignment",
			route: "/assignment",
			icon: "https://cdn.lordicon.com/ghhwiltn.json",
		},
		{
			pathname: "Result",
			route: "/result",
			icon: "https://cdn.lordicon.com/abwrkdvl.json",
		},
		{
			pathname: "Settings",
			route: "/settings",
			icon: "https://cdn.lordicon.com/dmgxtuzn.json",
			secondaryColor:"#00ADB5"
		},
	];
	return (
		<div className="w-32 flex items-center justify-center md:w-56">
			<ul className="w-full p-2">
				{links.map((link) => (
					<li
						className={` w-full my-2 hover:bg-[#08D9D6]/50 ${
							pathname === link.route ? "bg-[#08D9D6]/70" : ""
						}  rounded-md`}
						key={link.pathname}
					>
						<Link
							href={link.route}
							className={`flex items-center flex-col md:flex-row md:gap-4 py-2 p-1`}
						>
							<Icon src={link.icon} secondaryColor={link.secondaryColor||null}/>
							<h2 className=" leading-none text-basic md:text-lg text-center capitalize">
								{link.pathname}
							</h2>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Navbar;
