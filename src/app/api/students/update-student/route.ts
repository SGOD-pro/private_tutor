import { capitalizeWords } from "@/utils/Capitalize";
import ConnectDB from "@/db";
import userModel from "@/models/UserModel";
import { formDataToJson, uploadImage } from "../setStudent/route";

export async function POST(req: Request) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const _id = url.searchParams.get("id");
		if (!_id) {
			return Response.json(
				{ message: "Student not found", success: false },
				{ status: 404 }
			);
		}
		console.log(_id);
		const data = await req.formData();
		const file = data.get("picture");
		const jsonData = formDataToJson(data);
		console.log(jsonData);

		const userExists = await userModel.find({
			$or: [{ _id }, { admissionNo: jsonData["admissionNo"] }],
		});
		if (userExists.length === 0 || userExists.length > 1) {
			return Response.json(
				{ message: userExists.length > 1?"Duplicate admissionNo found":"User not found ", success: false },
				{ status: 400 }
			);
		}
		let photoUrl = await uploadImage(file);
		//TODO: update photo url
		const name = capitalizeWords(jsonData.name);
		const user = await userModel.findByIdAndUpdate(
			_id,
			{
				$set: {
					name,
					subject: jsonData["subject[]"],
					picture: photoUrl,
					admissionNo: jsonData["admissionNo"],
				},
			},
			{ new: true, runValidators: true }
		);
		const response = {
			...user.toJSON(),
			subjects: user?.subject?.join(","),
		};
		console.log(response);

		return Response.json(
			{
				message: "Student updated successfully.",
				success: true,
				data: response,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{
				message: "Cann't update student, Internal server error ",
				success: false,
			},
			{ status: 500 }
		);
	}
}
