import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import batchesModel from "@/models/Batches";
import { extractTime } from "@/utils/DateTime";
ConnectDB();

export async function POST(req: NextRequest) {
	try {
		const { subject, endTime, startTime, days } = await req.json();

		const sub = subject.name;
		const existsbatches = await batchesModel.aggregate([
			{
				$match: { subject: sub },
			},
			{
				$count: "total_count",
			},
		]);
		console.log(existsbatches);
		console.log(sub, endTime, startTime, days);

		const len = existsbatches[0]?.total_count ?? 0;
		console.log(len);

		const batchName = `${sub}-${len}`;
		const data = await batchesModel.create({
			subject: sub,
			batchName,
			startTime,
			endTime,
			days,
		});
		const modifiedData={
			_id:data._id,
			subject:data.subject,
			batchName:data.batchName,
			time:extractTime(data.startTime)+"-"+extractTime(data.endTime),
			days:data.days?.join(","),
		}
		return NextResponse.json({ message: "success", data:modifiedData, status: true });
	} catch (error: any) {
		return NextResponse.json({ message: error.message });
	}
}
