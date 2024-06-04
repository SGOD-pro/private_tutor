import ConnectDB from "@/db";
import attdenceModle from "@/models/Attendence";

export async function GET(req: Request) {
	await ConnectDB();
	try {
		const data = await attdenceModle.aggregate([
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
			},
		]);
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
