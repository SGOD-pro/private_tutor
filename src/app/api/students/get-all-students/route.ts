import ConnectDB from "@/db";
import userModel from "@/models/UserModel";

export async function GET(req: Request) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		let skip: string | null = url.searchParams.get("skip");
		let limit: string | null = url.searchParams.get("limit");

		let skipNumber: number = 0;
		let limitNumber: number = 0;

		if (skip !== null) {
			skipNumber = parseInt(skip, 10);
		}

		if (limit !== null) {
			limitNumber = parseInt(limit, 10);
		}
		console.log(limitNumber, skipNumber);
		
		const allUsers = await userModel.aggregate([
			{
				$unwind: "$subject",
			},
			{
				$lookup: {
					from: "batches",
					localField: "subject",
					foreignField: "subject",
					as: "subjectWiseBatches",
					pipeline: [
						{
							$project: {
								startTime: 0,
								endTime: 0,
							},
						},
					],
				},
			},
			{
				$group: {
					_id: "$_id",
					name: {
						$first: "$name",
					},
					admissionNo: {
						$first: "$admissionNo",
					},
					subjects: {
						$push: "$subject",
					},
					subjectWiseBatches: {
						$push: "$subjectWiseBatches",
					},
					picture:{$first:"$picture"},
				},
			},
			{ $sort: { _id: -1 } },
			{ $skip: skipNumber },
			{ $limit: limitNumber },
			{
				$project: {
					_id: 1,
					name: 1,
					admissionNo: 1,
					subjects: {
						$reduce: {
							input: "$subjects",
							initialValue: "",
							in: {
								$concat: [
									"$$value",
									{ $cond: [{ $eq: ["$$value", ""] }, "", ", "] },
									"$$this",
								],
							},
						},
					},
					picture: 1,
					subjectWiseBatches: 1,
				},
			},
		]);
		return Response.json({
			success: true,
			data: allUsers,
			message: "All students fetched successfully",
		});
	} catch (error) {
		console.log(error);

		return Response.json(
			{ success: false, message: "Cann't get the student informations" },
			{ status: 500 }
		);
	}
}
