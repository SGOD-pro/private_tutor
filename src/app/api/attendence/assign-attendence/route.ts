import ConnectDB from "@/db";
import attendenceModel from "@/models/Attendence";
import studentModel from "@/models/StudentModel";
import mongoose from "mongoose";

export async function POST(req: Request) {
	ConnectDB();
	try {
		const { batchId, studentsId } = await req.json();
		console.log(studentsId);
		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);

		const data = await attendenceModel.findOne({
			batchId,
			createdAt: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
		});
		if (data) {
			data.studentsId = studentsId;
			await data.save();

			// const result = await User.updateMany(
			// 	{ _id: { $in: ids } },
			// 	{ $inc: { presents: -1 } }
			// );
			return Response.json(
				{ success: true, message: "Attendence updated successfully." },
				{ status: 200 }
			);
		}
		await attendenceModel.create({
			batchId,
			studentsId,
		});
		const objectIds = studentsId.map((id:string) => new mongoose.Types.ObjectId(id));
		await studentModel.updateMany(
            { _id: { $in: objectIds } },
            { $inc: { presents: 1 } }
        );
		return Response.json(
			{ success: true, message: "Attendence added successfully" },
			{ status: 200 }
		);
	} catch (error) {
		//console.log(error)
		return Response.json(
			{ success: false, message: "Cann't add attendence successfully" },
			{ status: 500 }
		);
	}
}

export async function GET(req: Request) {
	ConnectDB();
	try {
		const url = new URL(req.url);
		const batchId = url.searchParams.get("id");
		if (!batchId) {
			throw new Error("can't get batch id");
		}

		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);

		const data = await attendenceModel.findOne({
			batchId,
			createdAt: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
		});
		
		return Response.json(
			{ success: true, message: "Fetched attendence record.", data },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		
		return Response.json(
			{ success: false, message: "Cann't get attendence record" },
			{ status: 500 }
		);
	}
}
