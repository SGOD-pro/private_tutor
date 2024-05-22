import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import subjectModel from "@/models/Subjects";
import { capitalizeWords } from "@/utils/Capitalize";
ConnectDB();

export async function POST(req: NextRequest) {
	try {
		let reqBody = await req.json();
		for (const key in reqBody) {
			reqBody[key] = capitalizeWords(reqBody[key]);
		}
        const {subject}=reqBody
        if (!subject || subject.trim() === "") {
			throw new Error("Invalid subject");
		}
		console.log(subject);

		const createdSub = await subjectModel.create({ subject });
        
		return NextResponse.json({
			message: "Added successfully",
			createdSub,
			status: true,
		});
	} catch (error:any) {
		return NextResponse.json({
			message: error.message,
			status: 500,
		});
	}
}
