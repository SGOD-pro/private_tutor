import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import batchModel from "@/models/Batches";
import { URL } from "url";

export async function GET(req: NextRequest) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const _id = url.searchParams.get("id");
		if (!_id) {
			return Response.json(
				{ message: "Invalid id", success: "false" },
				{ status: 404 }
			);
		}
		const batch = await batchModel.findById(_id);
		if (!batch) {
			const error: any = new Error("Could not find");
			error.status = 404;
			throw error;
		}
		console.log(`Batch found: ${batch}`);
		await batch.deleteOne();
		return NextResponse.json({ message: "Deleted", _id, status: true });
	} catch (error: any) {
		console.log(error);
		return NextResponse.json(
			{ error: error.message, status: false },
			{ status: 500 }
		);
	}
}
