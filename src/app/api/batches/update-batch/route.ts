import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import batchesModel from "@/models/Batches";
import { extractTime } from "@/utils/DateTime";

export async function POST(req: NextRequest) {
	await ConnectDB();
	try {
		const { subject, endTime, startTime, days } = await req.json();
		const url = new URL(req.url);
		const _id = url.searchParams.get("_id");
		const data = await batchesModel.findByIdAndUpdate(
			_id,
			{
				$set: {
					subject: subject.name,
					startTime: extractTime(startTime),
					endTime: extractTime(endTime),
					days,
				},
			},
			{ new: true }
		);
		const modifiedData = {
			_id: data._id,
			subject: data.subject,
			time: data.startTime + " - " + data.endTime,
			days: data.days?.join(","),
		};
		console.log(modifiedData);

		return NextResponse.json({
			message: "success",
			data: modifiedData,
			status: true,
		});
	} catch (error: any) {
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}
