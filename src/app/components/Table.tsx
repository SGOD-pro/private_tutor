import React, { memo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

type DeleteFunction = (id: string) => Promise<boolean>;
type EditFunction = (data: any) => void;

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

function BasicDemo({
	deleteFunction,
	editFunction,
	columns,
	values,
}: TableProps) {
	const ButtonTemplate = ({
		data,
		deleteFunction,
		editFunction,
	}: {
		data: any;
		deleteFunction?: (id: string) => Promise<boolean>;
		editFunction?: (data: any) => void;
	}) => {
		const [loading, setLoading] = useState(false);

		const handleDelete = async () => {
			if (!deleteFunction) return;
			setLoading(true);
			await deleteFunction(data._id);
			setLoading(false);
		};

		return (
			<div className=" flex gap-1">
				{deleteFunction && (
					<button
						className="bg-gradient-to-tl to-rose-400 from-rose-600 shadow-rose-800/90 shadow-lg hover:shadow-none hover:scale-95 transition-all rounded-r-sm rounded-l-xl p-3 grid place-items-center"
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
						className="bg-gradient-to-tl to-emerald-400 from-emerald-600 shadow-emerald-800/90 shadow-lg hover:shadow-none hover:scale-95 transition-all rounded-l-sm rounded-r-xl p-3 grid place-items-center"
						onClick={() => editFunction(data)}
					>
						<i className="pi pi-pen-to-square"></i>
					</button>
				)}
			</div>
		);
	};

	return (
		<div className="card m-0 p-0">
			<DataTable
				value={values}
				tableStyle={{ minWidth: "17rem", width: "100%", padding: 0, margin: 0 }}
				className="m-0 p-0"
			>
				{columns?.map((data, index): any => (
					<Column field={data.field} header={data.header} key={index}></Column>
				))}
				{(deleteFunction||editFunction)&&<Column
					key="action"
					body={(rowData) => (
						<ButtonTemplate
							data={rowData}
							deleteFunction={deleteFunction}
							editFunction={editFunction}
						/>
					)}
					header="Actions"
				/>}
			</DataTable>
		</div>
	);
}
export default  memo(BasicDemo)