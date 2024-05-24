"use client";

import { notFound } from "next/navigation";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import QueryTable from "../../components/QueryTable";
function page({ params }) {
	
	
	const show = useRef<HTMLDivElement>(null);
	const [Columns, setColumns] = useState([]);
	const [values, setValues] = useState({});
	useEffect(() => {
		notFound()
		axios.get(`/api/allRecords?fetch=${params.slug}`).then((response) => {
			if (show.current) {
				show.current.innerHTML = response.data.fetch;
			}
		});
	}, []);
	return (
		<>
			<QueryTable columns={Columns} values={values}></QueryTable>
		</>
	);
}

export default page;
