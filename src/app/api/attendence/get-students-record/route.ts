import ConnectDB from "@/db";
import attendenceModel from "@/models/Attendence";
import mongoose from "mongoose";

export async function GET(req: Request) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		const batchId = url.searchParams.get("batch");
		console.log(batchId,id)
		if (!id || !batchId) {
			return Response.json(
				{ message: "Cann't get the id", success: false },
				{ status: 404 }
			);
		}
		const data = await attendenceModel.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$unwind: {
					path: "$studentsId",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: "students",
					localField: "studentsId",
					foreignField: "_id",
					as: "student",
					pipeline: [
						{
							$unwind: {
								path: "$presentByBatch",
							},
						},
						{
							$match: {
								"presentByBatch.batchId": new mongoose.Types.ObjectId(batchId),
							},
						},
						{
							$project: {
								name: 1,
								picture: 1,
								presents: "$presentByBatch.presents",
							},
						},
					],
				},
			},
			{
				$addFields: {
					student: {
						$arrayElemAt: ["$student", 0],
					},
				},
			},
			{
				$group: {
					_id: "$_id",
					students: {
						$push: "$student",
					},
				},
			},
		]);
		return Response.json(
			{ message: "success", data: data[0], success: true },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);

		return Response.json(
			{ message: "Connot get the student record", success: false },
			{ status: 500 }
		);
	}
}
