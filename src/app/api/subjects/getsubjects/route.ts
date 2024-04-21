import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import subjectModel from "@/models/Subjects";
ConnectDB();

export async function GET(req: NextRequest) {
	try {
		const allSubjects = await subjectModel.find();
        console.log(allSubjects);
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
