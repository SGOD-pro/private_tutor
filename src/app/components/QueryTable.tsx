"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";

interface TableProps{
	columns:string[];
	values:any;
}


function QueryTable({columns,values}:TableProps) {
	const [products, setProducts] = useState([
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
		{
			id: "1000",
			code: "f230fh0g3",
			name: "souvik karmakar",
			description: "Product Description",
			image: "bamboo-watch.jpg",
			price: 65,
			category: "Accessories",
			quantity: 24,
			inventoryStatus: "INSTOCK",
			rating: 5,
		},
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
	const [nameFilterValue, setNameFilterValue] = useState("");
	const [filters, setFilters] = useState({
		name: { value: null as string | null, matchMode: FilterMatchMode.STARTS_WITH },
	});
	const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		let _filters = { ...filters };
        _filters["name"].value = value !== '' ? value : null; 
		setFilters(_filters);
		setNameFilterValue(value);
	};
	const renderHeader = () => {
		return (
			<div className="flex justify-between sticky top-0 p-5">
				<h2 className="text-white font-mono text-4xl">Attendence</h2>
				<span className="p-input-icon-right bg-[#232D3F] rounded-md">
					<i className="pi pi-search" />
					<input type="text" onChange={onGlobalFilterChange} />
				</span>
			</div>
		);
	};
	const header = renderHeader();
	return (
		<div className="card rounded-lg rounded-l-[2rem] table-div h-full overflow-auto relative">
			<DataTable
				value={products}
				removableSort
				tableStyle={{ minWidth: "50rem" }}
				header={header}
				style={{ height: "100%" }}
			>
				<Column
					field="code"
					header="Code"
					sortable
					style={{ width: "25%" }}
				></Column>
				<Column
					field="name"
					header="Name"
					sortable
					style={{ width: "25%" }}
				></Column>
				<Column
					field="category"
					header="Category"
					sortable
					style={{ width: "25%" }}
				></Column>
				<Column
					field="quantity"
					header="Quantity"
					sortable
					style={{ width: "25%" }}
				></Column>
			</DataTable>
		</div>
	);
}

export default QueryTable;
