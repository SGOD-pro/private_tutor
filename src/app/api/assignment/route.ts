import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import assignmentModel from "@/models/Assignment";
import formDataToJson from "@/utils/FormData";
import uploadImage from "@/utils/UploadColudinary";

export async function POST(req: NextRequest) {
	await ConnectDB();
	try {
		const data = await req.formData();

		const file = data.get("fileUrl");
		const jsonData = formDataToJson(data);
		let photoUrl;
		if (file) {
			photoUrl = await uploadImage(file);
			console.log(photoUrl);
		}
		const created = await assignmentModel.create({
			fileURL: photoUrl,
			explanation: jsonData["explanation"],
			batch: jsonData["batch"],
			submissionDate: new Date(jsonData["submissionDate"]),
		});
		console.log(created);
		if (!created) {
			return NextResponse.json(
				{ message: "Error creating assignment", success: false },
				{ status: 409 }
			);
		}
		return NextResponse.json({
			message: "Added assignment",
			data: created,
			success: true,
		});
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ message: error.message });
	}
}

export async function GET() {
	try {
		await ConnectDB();
		const assignment = await assignmentModel.aggregate([
			{
				$sort: {
					createdAt: -1,
				},
			},

			{
				$lookup: {
					foreignField: "_id",
					localField: "batch",
					from: "batches",
					as: "batch",
				},
			},
			{
				$addFields: {
					subbmissionDate: {
						$toDate: "$subbmissionDate",
					},
					batch: {
						$arrayElemAt: ["$batch", 0],
					},
				},
			},
			{
				$addFields: {
					days: {
						$reduce: {
							input: "$batch.days",
							initialValue: "",
							in: { $concat: ["$$value", ", ", "$$this"] },
						},
					},
				},
			},
			{
				$addFields: {
					subbmissionDate: {
						$concat: [
							{
								$substr: [
									{
										$dateToString: {
											format: "%d/%m/%Y",
											date: "$subbmissionDate",
										},
									},
									0,
									6,
								],
							},
							{
								$substr: [
									{
										$dateToString: {
											format: "%d/%m/%Y",
											date: "$subbmissionDate",
										},
									},
									8,
									2,
								],
							},
						],
					},
					days: {
						$cond: {
							if: { $or: [{ $eq: ["$days", ""] }, { $eq: ["$days", null] }] },
							then: "",
							else: {
								$substrCP: [
									"$days",
									2,
									{ $subtract: [{ $strLenCP: "$days" }, 1] },
								],
							},
						},
					},
					batchTime: {
						$concat: ["$batch.startTime", " - ", "$batch.endTime"],
					},
				},
			},
			{
				$project: {
					title: 1,
					subbmissionDate: 1,
					batch: { $concat: ["$days", " (", "$batchTime", ")"] },
					subject: "$batch.subject",
					batchId: "$batch._id",
					explanation: 1,
				},
			},
		]);
		return Response.json(
			{ message: "Fetched all assignments", success: true, data: assignment },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);

		return Response.json(
			{ message: "Cannot getting asssignmets", success: false },
			{ status: 500 }
		);
	}
}
