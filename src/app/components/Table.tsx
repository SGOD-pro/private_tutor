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
	const [products, setProducts] = useState<Product[]>([
		{
			id: "1000",
			code: "f230fh0g3",
			name: "Bamboo Watch",
			description: "Product Description",
			image: "bamboo-watch.jpg",
			price: 65,
			category: "Accessories",
			quantity: 24,
			inventoryStatus: "INSTOCK",
			rating: 5,
		},
	]);

	// useEffect(() => {
	//     ProductService.getProductsMini().then(data => setProducts(data));
	// }, []);
	const ButtonTemplate = (id: string) => {
		return (
			<div className=" flex gap-2">
				{deleteFunction && (
					<button
						className="bg-red-600 rounded-lg p-3 grid place-items-center"
						onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
							(event.target as HTMLButtonElement).setAttribute(
								"disabled",
								"true"
							);
							event.currentTarget.innerHTML =
								"<i className='pi pi-spin pi-spinner'></i>";
							const deleteResult = await deleteFunction(id);

							if (deleteResult === false) {
								(event.target as HTMLButtonElement).removeAttribute("disabled");

								event.currentTarget.innerHTML =
									"<i className='pi pi-trash'></i>";
							}
						}}
					>
						<i className="pi pi-trash"></i>
					</button>
				)}
				{editFunction && (
					<button
						className="bg-emerald-600 rounded-lg p-3 grid place-items-center"
						onClick={() => editFunction(id)}
					>
						<i
							className="pi 
pi-pen-to-square"
						></i>
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
					key="delete"
					body={(rowData) => ButtonTemplate(rowData._id)}
					header="Actions"
				/>
			</DataTable>
		</div>
	);
}
