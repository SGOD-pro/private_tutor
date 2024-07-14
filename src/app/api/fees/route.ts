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
					admissionDate: 1,
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
						$push: "$admissionDate",
					},
				},
			},
			{ $project: { _id: 0, dates: 1 } }
		]);
		
		console.log(admissionAt[0].admissionDate);
		console.log( lastFees.length > 0 ? lastFees[0].dates : undefined);
		return Response.json(
			{
				message: "New student",
				success: true,
				data: {
					admissionDate: admissionAt[0].admissionDate,
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
		let noOfMonths =1
		const Months = url.searchParams.get("months");
		if (typeof Months === "string") {
			noOfMonths=parseInt(Months)
		}
		console.log(noOfMonths);
		
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
		let month = std.admissionDate;
		if (exists.length > 0) {
			const latestPaidMonth = getNextMonth(exists[0].paidMonth);
			month = latestPaidMonth;
		}
		let paidFeesArray=[]
		for (let i = 0; i < noOfMonths; i++) {
			paidFeesArray.push({ studentId: std._id, paidMonth: month })
			month=getNextMonth(month)
		}

		const paidFees = await feesModel.insertMany(paidFeesArray)

		const paidMonth = new Date(paidFees[noOfMonths-1].paidMonth.getTime());
		
		return Response.json(
			{
				message: noOfMonths===1?`${getMonthName(paidMonth)}} Payment successfully`: "Payment successfully"
			},

			{ status: 201 }
		);
	} catch (error: any) {
		console.log(error);

		return Response.json(
			{ message: error.message || "Payment unsuccessful", success: false },
			{ status: 500 }
		);
	}
}
