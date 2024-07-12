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
				},
			},
			{
				$addFields: {
					endDateTime: {
						$dateFromString: {
							dateString: {
								$concat: [
									{
										$dateToString: {
											format: "%Y-%m-%d",
											date: "$$NOW",
										},
									},
									"T",
									"$endTime",
									":00Z",
								],
							},
						},
					},
					startDateTime: {
						$dateFromString: {
							dateString: {
								$concat: [
									{
										$dateToString: {
											format: "%Y-%m-%d",
											date: "$$NOW",
										},
									},
									"T",
									"$startTime",
									":00Z",
								],
							},
						},
					},

					currentDateTimeIST: {
						$dateAdd: {
							startDate: "$$NOW",
							unit: "minute",
							amount: 330, // 5.5 hours in minutes
						},
					},
				},
			},
			{
				$redact: {
					$cond: {
						if: {
							$lt: ["$endDateTime", "$currentDateTimeIST"],
						},
						then: "$$KEEP",
						else: "$$PRUNE",
					},
				},
			},
			{
				$sort: {
					endDateTimeIST: -1,
				},
			},
			{
				$limit: 1,
			},
			{
				$project: {
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
