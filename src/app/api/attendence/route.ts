import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import userModel from "@/models/StudentModel";
import mongoose from "mongoose";


export async function GET(req: Request) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		if (!id) {
			return Response.json(
				{ success: false, message: "cannot get batch" },
				{ status: 404 }
			);
		}console.log(id);

		const users = await userModel.aggregate([
			{ $match: { batches: new mongoose.Types.ObjectId(id)} },
			{
				$addFields: {
					subject: {
						$reduce: {
							input: "$subjects",
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
console.log(users);

		return Response.json({
			success: true,
			data:users,
			message: "Done!",
		});
	} catch (error) {
		return Response.json({success:false,message:"Cann't get batch details! Internal server error"},{status:500});
	}
}
