import connectDb from "@/db";
import Attendence from "@/models/Attendence";
import studentModel from "@/models/StudentModel";
import mongoose from "mongoose";
export async function GET(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		console.log(id);

		if (!id) {
			const err: any = new Error("ID is required to delete a document");
			err.status = 404;
			throw err;
		}
		const student = await studentModel.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(id) } },
			{
			  $unwind: {
				path: "$batches"
			  }
			},
			{
			  $lookup: {
				from: "attendences",
				localField: "batches",
				foreignField: "batchId",
				as: "presents",
				pipeline: [
				  {
					$lookup: {
					  from: "batches",
					  localField: "batchId",
					  foreignField: "_id",
					  as: "subject",
					  pipeline: [
						{
						  $project: {
							subject: "$subject",
							_id: 0
						  }
						}
					  ]
					}
				  },
				  {
					$addFields: {
					   adjustedCreatedAt: {
						$dateAdd: {
						  startDate: {
							$dateAdd: {
							  startDate: "$createdAt",
							  unit: "hour",
							  amount: 5
							}
						  },
						  unit: "minute",
						  amount: 30
						}
					  },
					  subject: {
						$arrayElemAt: ["$subject", 0]
					  },
					  present: {
						$cond: {
						  if: {
							$in: [new mongoose.Types.ObjectId(id), "$studentsId"]
						  },
						  then: true,
						  else: false
						}
					  }
					}
				  },
				  {
					$addFields: {
					  date: {
						$dateToString: {
						  format: "%m-%d-%Y",
						  date: "$adjustedCreatedAt"
						}
					  }
					}
				  },
				  {
					$project: {
					  createdAt: 1,
					  batchId: 1,
					  date: 1,
					  subject: "$subject.subject",
					  present: 1
					}
				  }
				]
			  }
			},
			{
			  $lookup: {
				from: "batches",
				localField: "batches",
				foreignField: "_id",
				as: "subjects",
				pipeline: [
				  {
					$project: {
					  name: "$subject",
					  code: "$_id",
					  _id: 0
					}
				  }
				]
			  }
			},
			{
			  $addFields: {
				subjects: {
				  $arrayElemAt: ["$subjects", 0]
				},
				presents: {
				  $arrayElemAt: ["$presents", 0]
				}
			  }
			},
			{
			  $group: {
				_id: "$_id",
				name: {
				  $first: "$name"
				},
				admissionNo: {
				  $first: "$admissionNo"
				},
				subjects: {
				  $push: "$subjects"
				},
				presents: {
				  $push: "$presents"
				}
			  }
			}
		  ]);

		console.log(student[0]);
		return Response.json(
			{ message: "Student record fetched..", success: true, data: student[0] },
			{ status: 200 }
		);
	} catch (error: any) {
		return Response.json(
			{ message: error.message || "Cann't get the student record." },
			{ status: error.status || 500 }
		);
	}
}
