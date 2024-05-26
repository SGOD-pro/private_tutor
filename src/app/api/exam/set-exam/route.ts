import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import examModel from "@/models/Exam";

export async function POST(req: NextRequest) {
	await ConnectDB();
	try {
		const { title, caption, batch, date } = await req.json();
		const created = await examModel.create(
			{
				title,
				caption,
				batch: batch.code,
				date,
			}
		);
		if (!created) {
			return NextResponse.json(
				{ message: "Error to adding exam", success: false },
				{ status: 409 }
			);
		}
		return NextResponse.json({
			message: "Exam added",
			data: created,
			success: true,
		});
	} catch (error: any) {
		return NextResponse.json({ message: error.message });
	}
}