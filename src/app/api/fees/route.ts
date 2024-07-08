import connectDb from "@/db";
import feesModel from "@/models/FeesModel";
import studentModel from "@/models/StudentModel";
import { getMonthName, getNextMonth } from "@/utils/DateTime";
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
		const admissionAt = await studentModel.aggregate([
			{ $match: { admissionNo: id } },
			{
				$project: {
					createdAt: 1,
				},
			},
		]);
		if (admissionAt.length===0) {
			return Response.json(
				{
					message: "Cann't find student",
					success: false,
				},
				{ status: 404 }
			);
		}
		const lastFees = await feesModel.aggregate([
			{ $match: { studentId: admissionAt[0]._id } },
			{
				$group: {
					_id: null,
					dates: {
						$push: "$createdAt",
					},
				},
			},
			{ $project: { _id: 0, dates: 1 } }
		]);
		
		console.log(admissionAt[0].createdAt);
		console.log( lastFees.length > 0 ? lastFees[0].dates : undefined);
		return Response.json(
			{
				message: "New student",
				success: true,
				data: {
					admissionDate: admissionAt[0].createdAt,
					feesPaidDetails: lastFees.length > 0 ? lastFees[0].dates : undefined,
				},
			},
			{ status: 200 }
		);
		
	} catch (error: any) {
		console.log(error);
		
		return Response.json(
			{
				message: error.message || "Connot get the fees record",
				success: false,
			},
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		const _id = url.searchParams.get("id");
		if (!_id) {
			return Response.json({ message: "Cannot get id" }, { status: 403 });
		}
		const std = await studentModel.findById(_id);
		if (!std) {
			return Response.json({ message: "Cannot get student" }, { status: 404 });
		}
		const exists = await feesModel.aggregate([
			{ $match: { studentId: new mongoose.Types.ObjectId(std._id) } },
			{ $sort: { paidMonth: -1 } },
			{ $limit: 1 },
		]);
		let month = std.createdAt;
		// console.log(exists[0]);

		if (exists.length > 0) {
			const latestPaidMonth = getNextMonth(exists[0].paidMonth);
			month = latestPaidMonth;
		}
		console.log(month);

		const paidFees = await feesModel.create({
			studentId: std._id,
			paidMonth: month,
		});
		const paidMonth = new Date(paidFees.paidMonth.getTime());
		paidFees.paidMonth.setMonth(paidFees.paidMonth.getMonth() + 1);
		console.log("month " + getMonthName(paidFees.paidMonth).slice(0, 3));
		console.log("paid month " + getMonthName(paidMonth));
		return Response.json(
			{
				message: `${getMonthName(paidMonth)} Paid successfully `,
				data: getMonthName(paidFees.paidMonth).slice(0, 3),
			},

			{ status: 201 }
		);
	} catch (error: any) {
		console.log(error);

		return Response.json(
			{ message: error.message || "Connot set fees record", success: false },
			{ status: 500 }
		);
	}
}
