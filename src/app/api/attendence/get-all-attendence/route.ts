import ConnectDB from "@/db";
import attdenceModle from "@/models/Attendence";

export async function GET(req: Request) {
	await ConnectDB();

	const url = new URL(req.url);
	let startDate = url.searchParams.get("startDate");
	let endDate = url.searchParams.get("endDate");
	const pipeline: any[] = [];
	pipeline.push(
		{
			$addFields: {
				createdAt: {
					$dateFromParts: {
						year: { $year: "$createdAt" },
						month: { $month: "$createdAt" },
						day: { $dayOfMonth: "$createdAt" },
						hour: 0,
						minute: 0,
						second: 0,
						millisecond: 0
					}
				}
			}
		}
	)
	if (startDate && endDate) {
		console.log(new Date(startDate), endDate);

		pipeline.push({
			$match: {
				createdAt: { $gt: new Date(startDate), $lt: new Date(endDate) },
			},
		});
	} else if (startDate && !endDate) {
		console.log(new Date(startDate), endDate);
		pipeline.push({
			$match: { createdAt: new Date(startDate) },
		});
	}
	pipeline.push(
		{
			$addFields: {
				date: {
					$dateToString: {
						format: "%Y-%m-%d",
						date: "$createdAt",
					},
				},
			},
		},
		{
			$unwind: "$studentsId",
		},
		{
			$group: {
				_id: {
					date: "$date",
					batchId: "$batchId",
					originalId: "$_id",
				},
				noOfPresents: {
					$sum: 1,
				},
			},
		},
		{
			$lookup: {
				from: "batches",
				localField: "_id.batchId",
				foreignField: "_id",
				as: "BatchInfo",
				pipeline: [
					{
						$project: {
							subject: 1,
						},
					},
				],
			},
		},
		{
			$addFields: {
				BatchInfo: { $arrayElemAt: ["$BatchInfo", 0] },
			},
		},
		{
			$group: {
				_id: "$_id.date",
				batches: {
					$push: {
						batchName: "$BatchInfo.subject",
						noOfPresents: "$noOfPresents",
						batchId: "$_id.batchId",
						originalId: "$_id.originalId",
					},
				},
			},
		},
		{
			$sort: { _id: -1 },
		},
		{
			$project: {
				_id: 0,
				date: "$_id",
				batches: 1,
			},
		}
	);
	try {
		const data = await attdenceModle.aggregate(pipeline);

		return Response.json(
			{ message: "Fetched all attendence", data },
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{ success: false, message: "Cann't get the attendence informations" },
			{ status: 500 }
		);
	}
}
