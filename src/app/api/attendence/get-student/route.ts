import connectDb from "@/db";
import Attendence from "@/models/Attendence";
import studentModel from "@/models/StudentModel";
export async function GET(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		console.log(id);
		
		if (!id) {
			const err:any = new Error("ID is required to delete a document");
			err.status = 404;
			throw err;
		}
		//TODO: look up from batches for subjects , then get search form attendence by batches and how many documents are there and int how many documents the student id preseent
		const student = await studentModel.findById(id).select("-picture")
		return Response.json({message:"Student record fetched",success:true,student},{status:200})
	} catch (error: any) {
		return Response.json(
			{ message: error.message || "Cann't get the student record." },
			{ status: error.status || 500 }
		);
	}
}
