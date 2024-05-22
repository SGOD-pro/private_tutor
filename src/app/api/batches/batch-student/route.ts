import ConnectDB from "@/db";
import userModel from "@/models/UserModel";
import mongoose from "mongoose";

export async function POST(req: Request) {
	await ConnectDB();
	try {
		const { batches } = await req.json();
		const batchIds = batches.map(
			(batchId: string) => new mongoose.Types.ObjectId(batchId)
		);

		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		console.log(id);
		if (!id) {
			throw new Error("Id not found");
		}

		const user = await userModel.findByIdAndUpdate(
			id,
			{
				$set: { batches: batchIds },
			},
			{ new: true }
		);
		console.log(user);
		if (!user) {
			return Response.json(
				{ success: false, message: "user not found" },
				{ status: 404 }
			);
		}
		return Response.json(
			{ success: true, message: "Batches saved" },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);

		return Response.json(
			{ success: false, message: "Server error cann't save batches." },
			{ status: 500 }
		);
	}
}

export async function GET(req: Request) {
	await ConnectDB();

	const url = new URL(req.url);
	const id = url.searchParams.get("id");
	if (!id) {
		return Response.json({success:false,message:"Student not found.",data},{status:404})
	}
	try {
		await ConnectDB();
		const response = await userModel.aggregate(
			[
			{
				$match: { _id: new mongoose.Types.ObjectId(id) },
			},
			{
				$unwind: "$batches",
			},
			{
				$lookup: {
					from: "batches",
					localField: "batches",
					foreignField: "_id",
					as: "batch",
					pipeline: [
						{
							$project: {
								endTime: 0,
								startTime: 0,
							},
						},
					],
				},
			},
			{
				$addFields: {
					batch: {
						$first: "$batch",
					},
				},
			},
			{
				$addFields: {
					"batch.days": {
						$reduce: {
							input: "$batch.days",
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
			{
				$group: {
					_id: "$_id",
					batch: {
						$push: "$batch",
					},
				},
			},
		]);
		if (response.length===0) {
			return Response.json({success:false,},{status:201})
		}
		const data:any={}
		response[0].batch.map((batch:any) => {
			data[batch.subject]={name:batch._id,code:batch.days}
		})
		return Response.json({success:true,message:"Batches found",data},{status:200})
	} catch (error) {
		return Response.json({success:false,message:"Cann't get student details.Server error!"},{status:500})

	}
}
