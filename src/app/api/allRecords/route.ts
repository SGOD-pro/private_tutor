import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import studentModel from "@/models/UserModel"
import assignmentModel from "@/models/Assignment"
ConnectDB();

export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url);
		const fetch = url.searchParams.get("fetch");
		NextResponse.json({ fetch });
        const data=new Date()
        console.log(Date.now());
        
		return NextResponse.json({ fetch });
	} catch (error: any) {
		return NextResponse.json({ message: error.message });
	}
}
