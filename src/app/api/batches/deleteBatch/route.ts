import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import batchModel from "@/models/Batches";
import { URL } from "url";


export async function GET(req: NextRequest) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const _id = url.searchParams.get("id");
		console.log(_id);
		
		const deleted = await batchModel.findByIdAndDelete(_id);
		if (!deleted) {
			const error: any = new Error("Could not find");
			error.status = 404;
			throw error;
		}
		return NextResponse.json({ message: "Deleted", _id, status: true });
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ error: error.message, status: false });
	}
}
