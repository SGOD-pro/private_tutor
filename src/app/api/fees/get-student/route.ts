import connectDb from "@/db";
import feesModel from "@/models/FeesModel";
import studentModel from "@/models/StudentModel";
import { getMonthName } from "@/utils/DateTime";
import mongoose from "mongoose";

export async function GET(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		if (!id) {
			return Response.json({ message: "Cannot get id" }, { status: 400 });
		}
		const std = await studentModel.findOne({ admissionNo: id });
		if (!std) {
			return Response.json({ message: "Cannot get student" }, { status: 404 });
		}
		const studentExists = await feesModel.aggregate([
            {$match:{studentId:new mongoose.Types.ObjectId(std._id)}},
			{$sort:{"paidMonth":-1}},
			{$limit:1},
        ]);
		let month=getMonthName(std.createdAt)
		if (studentExists.length > 0) {
			const latestPaidMonth = new Date(studentExists[0].paidMonth);
			latestPaidMonth.setFullYear(latestPaidMonth.getFullYear());
			latestPaidMonth.setMonth(latestPaidMonth.getMonth() + 1);
			month=getMonthName(latestPaidMonth)
		}
		return Response.json(
			{
				message: "Fetched student record",
				success: true,
				data: {name:std.name,month:month.slice(0, 3),_id:std._id}
			},
			{ status: 200 }
		);
	} catch (error:any) {
		console.log(error);
		
		return Response.json(
			{
				message: error.message,
				success: false,
			},
			{ status: 500 }
		);
	}
}