import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import assignmentModel from "@/models/Assignment";
import formDataToJson from "@/utils/FormData";
import uploadImage from "@/utils/UploadColudinary";
import { extractDate } from "@/utils/DateTime";
import Batches from "@/models/Batches";

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
		const subject= await Batches.findById(created._id);
		const responseData={
			fileURL:created.fileURL,
			explanation:created.explanation,
			issue:created.cratedAt,
			submissionDate:created.submissionDate,
			subject:subject?._id,
			_id:created._id,
		}
		return NextResponse.json({
			message: "Added assignment",
			data: responseData,
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
				$addFields: {
					submissionDate: {
						$dateToString: {
							format: "%d-%m-%Y",
							date: "$submissionDate",
						},
					},
					issue: {
						$dateToString: {
							format: "%d-%m-%Y",
							date: "$createdAt",
						},
					},
				},
			},
			{
				$lookup: {
					from: "batches",
					localField: "batch",
					foreignField: "_id",
					as: "subject",
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
					subject: { $arrayElemAt: ["$subject", 0] },
				},
			},
			{
				$project: {
					fileURL: 1,
					explanation: 1,
					issue: 1,
					submissionDate: 1,
					subject: "$subject.subject",
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
