import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import subjectModel from "@/models/Subjects";

export async function GET(req: NextRequest) {
	await ConnectDB();
	try {
		const allSubjects = await subjectModel.find();
		return NextResponse.json({
			message: "Fetched subjects successfully",
			allSubjects,
			status: true,
		});
	} catch (error:any) {
		return NextResponse.json({
			message: error.message,
			status: 500,
		});
	}
}
