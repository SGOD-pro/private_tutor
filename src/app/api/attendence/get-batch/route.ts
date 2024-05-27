import ConnectDB from "@/db";
import batchModel from "@/models/Batches";

export async function GET(req: Request) {
	await ConnectDB();
	try {
        const url=new URL(req.url);
        const day=url.searchParams.get('day');
        if (!day) {
            return Response.json(
                { message: "Cann't get the current day." },
                { status: 404 }
            );
        }
		const current = await batchModel.aggregate([
			{
				$match: {
					days: day,
				},
			},
			{
				$addFields: {
					endTimeDate: {
						$dateFromString: {
							dateString: {
								$concat: [
									{
										$dateToString: {
											format: "%Y-%m-%dT",
											date: new Date(),
										},
									},
									"$endTime",
									":00+05:30",
								],
							},
						},
					},
					currentTime: new Date(),
				},
			},
			{
				$addFields: {
					timeDifference: {
						$abs: {
							$subtract: ["$endTimeDate", "$currentTime"],
						},
					},
				},
			},
			{
				$sort: {
					timeDifference: 1,
				},
			},
			{
				$limit: 1,
			},
            {
                $project:{
                    _id:1
                }
            }
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
