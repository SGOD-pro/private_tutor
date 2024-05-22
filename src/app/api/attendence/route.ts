import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import batchModel from "@/models/Batches";
import userModel from "@/models/UserModel";
import { getNextHour } from "@/utils/DateTime";



export async function GET(req: Request) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const currentDay = url.searchParams.get("day");
		const time = url.searchParams.get("time");
		console.log(currentDay, time);
		if (!currentDay || !time) {
			return Response.json(
				{ success: false, message: "cannot find day and time" },
				{ status: 404 }
			);
		}
		const nextHour = getNextHour(time);
		const batch = await batchModel.aggregate([
			{ $match: { endTime: { $lte: nextHour, $gte: time }, days: currentDay } },
		]);

		if (batch.length === 0) {
			return Response.json(
				{ success: false, message: "Cann't get any batch!" },
				{ status: 400 }
			);
		}
		const users = await userModel.aggregate([
			{ $match: { batches: batch[0]._id } },
			{
				$addFields: {
					subject: {
						$reduce: {
							input: "$subject",
							initialValue: "",
							in: {
								$concat: [
									"$$value",
									{
										$cond: [
											{
												$eq: ["$$value", ""],
											},
											"",
											", ",
										],
									},
									"$$this",
								],
							},
						},
					},
				},
			},
		]);

		return Response.json({
			success: true,
			users,
			batch: batch[0]._id,
			message: "Done!",
		});
	} catch (error) {
		return Response.json({success:false,message:"Cann't get batch details! Internal server error"},{status:500});
	}
}
