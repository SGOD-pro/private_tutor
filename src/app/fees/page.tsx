"use client"

import React,{useState} from "react";
import QueryTable from "../components/QueryTable";
import InputFields from "../components/InputFields";

function Fees() {
    const [search, setSearch] = useState<{search:string}>({search:""})
	return (
		<>
			<div className="rounded-l-[44px]">
                <header className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Allocate fees</h2>
                    <div className=" w-1/2">
                        <InputFields  name={'search'} lable={"Admission no/Contact no"}  value={search.search} setValue={setSearch} placeholder={"By Admission no | Contact no"} />
                    </div>
                </header>
            </div>
		</>
	);
}

export default Fees;
