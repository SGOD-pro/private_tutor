import userModel from "@/models/StudentModel";
import { NextResponse, NextRequest } from "next/server";
import { capitalizeWords } from "@/utils/Capitalize";
import ConnectDB from "@/db";
import formDataToJson from "@/utils/FormData";
import uploadImage from "@/utils/UploadColudinary";

export async function POST(req: NextRequest) {
	await ConnectDB();
	try {
		const data = await req.formData();
		const file = data.get("picture");
		const jsonData = formDataToJson(data);
		const exists = await userModel.findOne({
			admissionNo: jsonData["admissionNo"],
		});
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
				(value) => value?.trim() === ""
			)
		) {
			return NextResponse.json(
				{ message: "Some attributes are missing", success: false },
				{ status: 400 }
			);
		}

		if (exists) {
			return NextResponse.json(
				{
					message: `Already admission no assigned to ${exists.name}.`,
					success: false,
				},
				{ status: 409 }
			);
		}
		let photoUrl;
		if (file) {
			photoUrl = await uploadImage(file);
		}

		const student = await userModel.create({
			admissionNo,
			picture: photoUrl || "",
			subjects,
			name,
			phoneNo,
			clg,
			institutionName,
			stream,
			fees,
		});
		const response = {
			...student.toJSON(),
			subjects: student?.subjects?.join(","),
		};
		return NextResponse.json(
			{
				message: (!file && !photoUrl)
					? "Student added successfully"
					: (file && !photoUrl)
						? "Student add but image not uploaded."
						: "Some other condition.",
				data: response,
				success: (!file && !photoUrl) ? true : false,
			},
			{ status: 200 }
		);
		
	} catch (error: any) {
		console.log(error);

		return NextResponse.json(
			{
				message: error.message || "Cannot add student! Server error",
				success: false,
			},
			{ status: 500 }
		);
	}
}
export async function GET() {
	await ConnectDB();
	try {
		const users = await userModel.aggregate([
			{
				$sort: { _id: -1 },
			},
			{
				$limit: 4,
			},
			{
				$addFields: {
					subjects: {
						$reduce: {
							input: "$subjects",
							initialValue: "",
							in: { $concat: ["$$value", ",", "$$this"] },
						},
					},
				},
			},
			{
				$addFields: {
					subjects: {
						$substrCP: [
							"$subjects",
							1,
							{ $subtract: [{ $strLenCP: "$subjects" }, 1] },
						],
					},
				},
			},
		]);
		return NextResponse.json({
			message: "Fetched students...",
			data: users,
			status: 200,
		});
	} catch (error: any) {
		console.log(error);

		return NextResponse.json({ message: error.message, status: 500 });
	}
}
