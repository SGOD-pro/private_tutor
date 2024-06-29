import connectDb from "@/db";
import feesModel from "@/models/FeesModel";
import studentModel from "@/models/StudentModel";
import mongoose from "mongoose";

export async function GET(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		if (!id) {
			return Response.json(
				{ message: "Connot get id", success: false },
				{ status: 404 }
			);
		}
		const lastFees = await feesModel.aggregate([
			{ $match: { studentId: new mongoose.Types.ObjectId(id) } },
			{ $sort: { createdAt: -1 } },
			{ $limit: 1 },
		]);        
		if (lastFees.length > 0) {
			return Response.json(
				{
					message: "Last fees",
					data: lastFees[0],
					success: true,
				},
				{ status: 200 }
			);
		}
		const admissionAt = await studentModel.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(id) } },
			{
				$addFields: {
					formattedDate: {
						$dateToString: {
							format: "%Y-%m",
							date: "$createdAt",
						},
					},
				},
			},
			{
				$project: {
					year: { $substr: ["$formattedDate", 0, 4] },
					month: { $substr: ["$formattedDate", 5, 2] },
				},
			},
		]);
        
		return Response.json(
			{
				message: "New student",
				success: true,
				data: {year:parseInt(admissionAt[0].year),month:(parseInt(admissionAt[0].month)-1)},
			},
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{ message: "Connot get the fees record", success: false },
			{ status: 500 }
		);
	}
}
