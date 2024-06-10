import { capitalizeWords } from "@/utils/Capitalize";
import ConnectDB from "@/db";
import userModel from "@/models/StudentModel";
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
		const data = await req.formData();
		const file = data.get("picture");
		const jsonData = formDataToJson(data);

		const name = capitalizeWords(jsonData.name);
		const phoneNo = jsonData["phoneNo[]"];
		const admissionNo = data.get("admissionNo");
		const clg = data.get("clg") === "true";
		const stream = data.get("stream");
		const subjects = jsonData["subject[]"];
		const institutionName = jsonData["institutionName"];
		let fees = 0;
		fees = parseFloat(jsonData["fees"] || 0);

		if (
			[name, admissionNo, stream, institutionName].some(
				(value) => !value || value.trim() === ""
			)
		) {
			return Response.json(
				{ message: "Some attributes are missing", success: false },
				{ status: 400 }
			);
		}

		const userExists = await userModel.find({
			$or: [{ _id }, { admissionNo: jsonData["admissionNo"] }],
		});
		if (userExists.length === 0 || userExists.length > 1) {
			return Response.json(
				{
					message:
						userExists.length > 1
							? "Duplicate admissionNo found"
							: "User not found ",
					success: false,
				},
				{ status: 400 }
			);
		}
		let photoUrl;
		if (file) {
			photoUrl = await uploadImage(file);
		}
		console.log(jsonData);
		const user = await userModel.findByIdAndUpdate(
			_id,
			{
				$set: {
					name,
					subjects,
					picture: photoUrl,
					admissionNo,
					clg,
					institutionName,
					stream,
					fees,
					phoneNo,
				},
			},
			{ new: true, runValidators: true }
		);

		if (!user) {
			throw new Error();
		}
		const response = {
			...user.toJSON(),
			subjects: user?.subjects?.join(","),
		};
		return Response.json(
			{
				message:
					file && !photoUrl
						? "Updated but photo not uploaded"
						: "Student updated successfully.",
				success: file && !photoUrl ? false : true,
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
