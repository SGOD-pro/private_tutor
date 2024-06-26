import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import batchesModel from "@/models/Batches";
import { extractTime } from "@/utils/DateTime";

export async function POST(req: NextRequest) {
	await ConnectDB();
	try {
		const { subject, endTime, startTime, days } = await req.json();
		
		if ([subject.name, endTime, startTime].some(x => !x||x.trim()==="")) {
			return Response.json({message:"Cannot get proper data"},{status:401})
		}
		const sTime=extractTime(startTime)
		const eTime=extractTime(endTime)
		const exists = await batchesModel.aggregate([
			{ $unwind: "$days" },
			{ $match: { days: { $in: days }, subject:subject.name, startTime:sTime } },
		]);
		
		if (exists.length > 0) {
			return NextResponse.json(
				{
					message: "Already have same batch!",
					success: false,
				},
				{ status: 400 }
			);
		}
		const data = await batchesModel.create({
			subject: subject.name,
			startTime: sTime,
			endTime: eTime,
			days,
		});

		const modifiedData = {
			_id: data._id,
			subject: data.subject,
			time: data.startTime + " - " + data.endTime,
			days: data.days?.join(","),
		};

		return NextResponse.json({
			message: "success",
			data: modifiedData,
			status: true,
		});
	} catch (error: any) {
		return NextResponse.json({ message: error.message||"Internal server error" },{status:500});
	}
}
