import ConnectDB from "@/db";
import { NextRequest, NextResponse } from "next/server";
import batcheModel from "@/models/Batches";
ConnectDB();

export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url);
		const day: string | null = url.searchParams.get("day");
		await batcheModel.aggregate([
			{
				$match: {
					days: "sun",
				},
			},
		]);
		return NextResponse.json({ message: "geting", data: day });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "not getting" });
	}
}
