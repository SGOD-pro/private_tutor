import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface Product {
	id: string;
	code: string;
	name: string;
	description: string;
	image: string;
	price: number;
	category: string;
	quantity: number;
	inventoryStatus: string;
	rating: number;
}
type DeleteFunction = (id: string) => Promise<boolean>;
type EditFunction = (id: string) => void;

interface Columns {
	field: string;
	header: string;
}

interface TableProps {
	deleteFunction?: DeleteFunction;
	editFunction?: EditFunction;
	columns: Columns[];
	values: any;
}

export default function BasicDemo({
	deleteFunction,
	editFunction,
	columns,
	values,
}: TableProps) {
	const [loading, setLoading] = useState(false);



	const ButtonTemplate = ({ data, deleteFunction, editFunction }: { data: any, deleteFunction?: (id: string) => Promise<boolean>, editFunction?: (id: string) => void }) => {
		const [loading, setLoading] = useState(false);
	  
		const handleDelete = async () => {
		  if (!deleteFunction) return;
		  setLoading(true);
		  await deleteFunction(data._id);
		  setLoading(false);
		};
	  
		return (
		  <div className=" flex gap-2">
			{deleteFunction && (
			  <button
				className="bg-gradient-to-tl to-red-400 from-red-600 rounded-lg p-3 grid place-items-center"
				onClick={handleDelete}
				disabled={loading}
			  >
				{loading ? (
				  <i className="pi pi-spin pi-spinner"></i>
				) : (
				  <i className="pi pi-trash"></i>
				)}
			  </button>
			)}
			{editFunction && (
			  <button
				className="bg-gradient-to-tl to-emerald-400 from-emerald-600 rounded-lg p-3 grid place-items-center"
				onClick={() => editFunction(data)}
			  >
				<i className="pi pi-pen-to-square"></i>
			  </button>
			)}
		  </div>
		);
	  };

	return (
		<div className="card">
			<DataTable
				value={values}
				tableStyle={{ minWidth: "40rem", width: "100%" }}
			>
				{columns?.map((data, index): any => (
					<Column field={data.field} header={data.header} key={index}></Column>
				))}
				<Column
					key="action"
					body={(rowData) => (
						<ButtonTemplate
							data={rowData}
							deleteFunction={deleteFunction}
							editFunction={editFunction}
						/>
					)}
					header="Actions"
				/>
			</DataTable>
		</div>
	);
}
