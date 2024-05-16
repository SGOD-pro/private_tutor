import ConnectDB from "@/db";
import userModel from "@/models/UserModel";

export async function GET(req: Request) {
	await ConnectDB();
	try {
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
				},
			},
			{ $sort: { admissionNo: -1 } },
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

					subjectWiseBatches: 1,
				},
			},
		]);
		console.log(allUsers);
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
