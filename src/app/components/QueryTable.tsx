"use client";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Image from "next/image";

import InputFields from "./InputFields";
import { useState } from "react";
import { set } from "mongoose";
interface ColumnProps {
	field: string;
	header: string;
}
interface TableProps {
	columns: ColumnProps[];
	values: any;
	Components?: React.FC<ComponentProps> | any;
}
interface ComponentProps {
	id: string;
	subjectWiseBatches?: any;
	subjects?: string;
}
export default function RemovableSortDemo({
	columns,
	values,
	Components,
}: TableProps) {
	const representativeBodyTemplate = (rowData: any) => {
		if (!rowData.picture) {
			return <span>{rowData.name}</span>;
		}

		return (
			<div className="flex items-center gap-2">
				<div className=" w-11 h-11 rounded-full overflow-hidden">
					<Image
						src={rowData.picture}
						alt={rowData.name[0]}
						className="w-full h-full object-cover object-top"
						width={56}
						height={56}
					/>
				</div>
				<span>{rowData.name}</span>
			</div>
		);
	};

	return (
		<div className="card">
			<DataTable
				value={values}
				sortMode="multiple"
				className=""
				tableStyle={{ minWidth: "500px" }}
			>
				{columns.map((col) => (
					<Column
						key={col.field}
						sortable
						field={col.field}
						header={col.header}
						body={col.field === "name" ? representativeBodyTemplate : undefined}
					/>
				))}
				<Column
					key={"actions"}
					className="flex justify-start gap-2"
					header="Actions"
					body={(rowData) =>
						Components && (
							<Components
								id={rowData._id}
								subjectWiseBatches={rowData.subjectWiseBatches || ""}
								subjects={rowData.subjects || ""}
							/>
						)
					}
				/>
			</DataTable>
		</div>
	);
}
