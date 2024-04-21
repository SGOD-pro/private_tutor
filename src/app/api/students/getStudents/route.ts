import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import userModel from "@/models/UserModel";

ConnectDB();

export async function GET() {
	try {
		const users = await userModel.aggregate([
			{
				$sort: { createdAt: -1 },
			},
			{
				$limit: 4,
			},
			{
				$addFields: {
					subject: {
						$reduce: {
							input: "$subject",
							initialValue: "",
							in: { $concat: ["$$value", ",", "$$this"] },
						},
					},
				},
			},
			{
				$project: {
					name: 1,
					admissionNo: 1,
					subject: {
						$substrCP: [
							"$subject",
							1,
							{ $subtract: [{ $strLenCP: "$subject" }, 1] },
						],
					},
				},
			},
		]);
		console.log(users);
		return NextResponse.json({
			message: "Fetched users...",
			data: users,
			status: 200,
		});
	} catch (error: any) {
		return NextResponse.json({ message: error.message, status: 500 });
	}
}
