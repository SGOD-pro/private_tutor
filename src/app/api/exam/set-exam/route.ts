import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import examModel from "@/models/Exam";

export async function POST(req: NextRequest) {
	await ConnectDB();
	try {
		const { title, caption, batch, date } = await req.json();
		console.log( title, caption, batch, date )
		const created = await examModel.create(
			{
				title,
				caption,
				batch,
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
		console.log(error);
		
		return NextResponse.json({ message: error.message },{status:500});
	}
}