import ConnectDB from "@/db";
import batchesModel from "@/models/Batches";

export async function GET(req: Request) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const day = url.searchParams.get("day");

		if (!day) {
			return Response.json(
				{ message: "Cann't get day", success: false },
				{ status: 404 }
			);
		}
		console.log(day);

		const batch = await batchesModel.aggregate([
			{ $match: { days: day } },
			{ $sort: { startTime: 1 } },
			{
				$addFields: {
					time: {
						$concat: ["$startTime", " - ", "$endTime"],
					},
					days: {
						$reduce: {
							input: "$days",
							initialValue: "",
							in: {
								$concat: ["$$value", ", ", "$$this"],
							},
						},
					},
				},
			},
			{
				$addFields: {
					code: "$_id",
					name: {
						$concat: ["$subject", " (", "$time", ")"],
					},
				},
			},
			{
				$project: {
					name: 1,
					code: 1,
					_id: 0,
				},
			},
		]);
		return Response.json(
			{ message: "Fetched successfuly", success: true, data: batch },
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{ message: "Cann't get day", success: false },
			{ status: 404 }
		);
	}
}

