import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import batchesModel from "@/models/Batches";
import { extractTime } from "@/utils/DateTime";

export async function POST(req: NextRequest) {
	await ConnectDB();
	try {
		const { subject, endTime, startTime, days } = await req.json();
		
		//TODO: check if there is already a batch in this date and time?
		console.log(subject, extractTime(startTime), days)
		const exists = await batchesModel.aggregate([
			{ $unwind: "$days" },
			{ $match: { days: { $in: days }, subject:subject.name, startTime:extractTime(startTime) } },
		]);
		console.log("post");
		console.log(exists);
		if (exists.length > 0) {
			return NextResponse.json(
				{
					message: "Already have batch!",
					success: false,
				},
				{ status: 400 }
			);
		}
		const data = await batchesModel.create({
			subject: subject.name,
			startTime: extractTime(startTime),
			endTime: extractTime(endTime),
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
		return NextResponse.json({ message: error.message },{status:500});
	}
}
