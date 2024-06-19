import ConnectDB from "@/db";
import assignmentModel from "@/models/Assignment"


export async function POST(req:Request) {
    await ConnectDB()
    try {
        const url=new URL(req.url)
        const id=url.searchParams.get('id')
        const assignment = await assignmentModel.findById(id)
        if (!assignment) {
            return Response.json({message:"Assignment not found"}, {status:404})
        }
        const { title, explanation, batch, subbmissionDate } = await req.json();
        assignment.title = title
        assignment.explanation = explanation
        assignment.batch = batch
        assignment.subbmissionDate = subbmissionDate
        await assignment.save();
        return Response.json({message:"Assignment update successfully"}, {status:200})

    } catch (error:any) {
        return Response.json({message:error.message||"Cannot update assignment"}, {status:500})
        
    }


}