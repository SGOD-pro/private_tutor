import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import batchModel from "@/models/Batches";
ConnectDB();

export async function GET(req: NextRequest) {
	try {
		const allBatches = await batchModel.aggregate([
			{
				$addFields: {
					endTime: {
						$add: ["$endTime", 19800000],
					},
					startTime: {
						$add: ["$startTime", 19800000],
					},
				},
			},
			{
				$addFields: {
					endTime: {
						$dateToString: { format: "%H:%M", date: "$endTime" },
					},
					startTime: {
						$dateToString: { format: "%H:%M", date: "$startTime" },
					},
				},
			},
			{
				$addFields: {
					time: {
						$concat: ["$startTime", " -- ", "$endTime"],
					},
					days: {
						$reduce: {
							input: "$days",
							initialValue: "",
							in: { $concat: ["$$value", ",", "$$this"] },
						},
					},
				},
			},

			{
				$project: {
				  _id: 1,
				  time: 1,
				  subject: 1,
				  batchName: 1,
				  days: {
					$cond: { if: { $eq: ["$days", ""] }, then: "", else: {
					  $substrCP: ["$days", 1, { $subtract: [{ $strLenCP: "$days" }, 2] }]
					} }
				  },
				},
			  }
		]);
		console.log(allBatches);
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
