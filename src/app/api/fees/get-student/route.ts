import connectDb from "@/db";
import Attendence from "@/models/Attendence";
import studentModel from "@/models/StudentModel";

 export async function GET(req:Request) {
    await connectDb()
    try {

        const url = new URL(req.url)
        const id=url.searchParams.get('id')
        if (!id) {
            return Response.json({message:"Gannot get id"},{status:400})
        }
        const std=await studentModel.findOne({admissionNo:id})
        if (!std) {
            return Response.json({message:"Gannot get student"},{status:404})
        }
        await Attendence.findOne({studentsId:std._id})
        //TODO: first check the studnet have any record present in fees model or not
        //TODO: if present then check UpdatedAt, because in updted at we get the last paid record
        //TODO: if the student is not present in fees model then return the createdAt month
        return Response.json(
			{
				message: "New student",
				success: true,
			},
			{ status: 200 }
		);
    } catch (error) {
        return Response.json(
			{
				message: "New student",
				success: true,
			},
			{ status: 500 }
		);
    }
 }