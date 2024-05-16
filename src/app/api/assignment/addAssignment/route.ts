import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import assignmentModel from "@/models/Assignment";
ConnectDB();

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const { title, explanation, batch, subbmissionDate } = await req.json();
		const created = await assignmentModel.create({
			title,
			explanation,
			batch,
			subbmissionDate,
		});
		return NextResponse.json({
			message: "Added assignment",
			data: created,
			success: true,
		});
	} catch (error: any) {
		return NextResponse.json({ message: error.message });
	}
}
