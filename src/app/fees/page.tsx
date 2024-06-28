"use client";

import React, { useState } from "react";
import QueryTable from "../components/QueryTable";
import InputFields from "../components/InputFields";
import Loading from "../components/Loading";

function Fees() {
	const [search, setSearch] = useState<{ search: string }>({ search: "" });
	return (
		<>
			<div className="rounded-l-[44px]">
				<header className="flex justify-between items-center border-b h-14">
					<h2 className="text-2xl font-semibold">Allocate fees</h2>
					<div className=" w-1/2">
						<InputFields
							name={"search"}
							lable={"Admission no/Contact no"}
							value={search.search}
							setValue={setSearch}
							placeholder={"By Admission no | Contact no"}
						/>
					</div>
				</header>
				<div className=" relative h-[calc(100vh-36px)] overflow-auto w-full">
					<Loading loading={false}>
						<QueryTable
							columns={[
								{ field: "admissionNo", header: "Admission no" },
								{ field: "fees", header: "Fees" },
							]}
							values={[]}
						/>
					</Loading>
				</div>
			</div>
		</>
	);
}

export default Fees;
