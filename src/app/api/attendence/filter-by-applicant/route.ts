import ConnectDB from "@/db";
import studentModel from "@/models/StudentModel";

export async function GET(req: Request) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const name = url.searchParams.get("name");
		const adno = url.searchParams.get("adno");
		if (name?.trim() == "" && adno?.trim() == "") {
			return Response.json(
				{ message: "Cannot get input data" },
				{ status: 400 }
			);
		}
		const pipeline = [];
		const pattern = new RegExp("^CA-\\d{2}/\\d{2}-\\d+$");
		if (adno) {
			const isMatch = pattern.test(adno);
			console.log(isMatch);
			if (isMatch) {
				pipeline.push({
					$match: {
						admissionNo: adno,
					},
				});
			} else {
				pipeline.push({
					$match: {
						name: { $regex: name, $options: "i" },
					},
				});
			}
		}
		pipeline.push(
			{
				$unwind: {
					path: "$presentByBatch",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: "batches",
					localField: "presentByBatch.batchId",
					foreignField: "_id",
					as: "batchName",
					pipeline: [
						{
							$project: {
								subject: 1,
								_id: 0,
							},
						},
					],
				},
			},
			{
				$addFields: {
					batchName: { $arrayElemAt: ["$batchName", 0] },
				},
			},
			{
				$addFields: {
					presentByBatch: {
						$concat: [
							{
								$toString: "$batchName.subject",
							},
							" - ",
							{
								$toString: "$presentByBatch.presents",
							},
						],
					},
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
					presentByBatch: {
						$push: "$presentByBatch",
					},
				},
			},
			{
				$addFields: {
					presentByBatch: {
						$reduce: {
							input: "$presentByBatch",
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
				},
			}
		);
		const data = await studentModel.aggregate(pipeline);

		return Response.json(
			{ message: "Fetched students", data },
			{ status: 200 }
		);
	} catch (error: any) {
		return Response.json(
			{ message: error.message || "Internalserver error." },
			{ status: 500 }
		);
	}
}
