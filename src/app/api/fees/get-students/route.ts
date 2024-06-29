import connectDb from "@/db";
import studentModel from "@/models/StudentModel";
export async function GET() {
	await connectDb();
	try {
		const data = await studentModel.aggregate([
			{
				$addFields: {
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
				},
			},
            {
                $project:{
                    subjects:1,
                    fees:1,
                    admissionNo:1,
                }
            }
		]);
		return Response.json({ message: "Data fetched.", data }, { status: 200 });
	} catch (error: any) {
        console.log(error);
		return Response.json(
            
			{ message: error.message || "Cannot get fees records" },
			{ status: 500 }
		);
	}
}
