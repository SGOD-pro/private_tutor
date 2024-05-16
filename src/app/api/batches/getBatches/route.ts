import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import batchModel from "@/models/Batches";
ConnectDB();

export async function GET(req: NextRequest) {
	try {
		const allBatches = await batchModel.aggregate([
			{
				$sort:{subject:1}
			},
			
			{
				$addFields: {
					time: {
						$concat: ["$startTime", " - ", "$endTime"],
					},
					days: {
						$reduce: {
							input: "$days",
							initialValue: "",
							in: { $concat: ["$$value", ", ", "$$this"] },
						},
					},
				},
			},

			{
				$project: {
				  _id: 1,
				  time: 1,
				  subject: 1,
				  days: {
					$cond: { if: { $eq: ["$days", ""] }, then: "", else: {
					  $substrCP: ["$days", 1, { $subtract: [{ $strLenCP: "$days" }, 1] }]
					} }
				  },
				},
			  }
		]);
		return NextResponse.json({
			message: "Fetched subjects successfully",
			allBatches,
			status: true,
		});
	} catch (error: any) {
		return NextResponse.json({
			message: error.message,
			status: 500,
		});
	}
}
