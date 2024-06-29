import ConnectDB from "@/db";
import batchModel from "@/models/Batches";

export async function GET(req: Request) {
	await ConnectDB();
	try {
		const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
		const currentDate = new Date();
		const day = daysOfWeek[currentDate.getDay()];

		const current = await batchModel.aggregate([
			{
				$match: {
					days: day,
					endTime: {
						$lt: new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString(),
					},
				},
			},
			{
				$sort: {
					endTime: -1,
				},
			},
			{
				$limit: 1,
			},
			{
				$project: {
					_id: 1,
					subject: 1,
				},
			},
		]);
		return Response.json(
			{ message: "Current batch", data: current[0] },
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{ message: "Cann't get current batch" },
			{ status: 500 }
		);
	}
}
