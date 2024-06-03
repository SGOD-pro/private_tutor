import userModel from "@/models/UserModel";
import { NextResponse, NextRequest } from "next/server";
import { capitalizeWords } from "@/utils/Capitalize";
import { cloudinaryUTIL } from "@/utils/Cloudinary";
import fs from "fs";
import { promisify } from "util";
import ConnectDB from "@/db";
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

export function formDataToJson(formData: FormData) {
	const json: { [key: string]: any } = {};

	for (const [key, value] of formData.entries()) {
		if (json[key] !== undefined) {
			if (!Array.isArray(json[key])) {
				json[key] = [json[key]];
			}
			json[key].push(value);
		} else {
			json[key] = value;
		}
	}
	return json;
}
export const  uploadImage=async(file:any)=>{
	if (file instanceof File) {
		let filePath;
		try {
			const buffer = await file.arrayBuffer();

			const filePath = "./public/" + Date.now().toString() + file.name;

			await writeFileAsync(filePath, Buffer.from(buffer));
	
			const uploadedFile: any = await cloudinaryUTIL(filePath);
			console.log(uploadedFile);
	
			if (filePath) {
				await unlinkAsync(filePath);
			}
			return uploadedFile?.url;
		} catch (error) {
			return false;
		}
	}
}

export async function POST(req: NextRequest) {
	await ConnectDB();
	try {
		const data = await req.formData();
		const file = data.get("picture");
		const jsonData = formDataToJson(data);
		const exists = await userModel.findOne({
			admissionNo: data.get("admissionNo"),
		});
		if (exists) {
			return NextResponse.json(
				{ message: "Already student exists.", success: false },
				{ status: 400 }
			);
		}
		let photoUrl= await uploadImage(file);
		
		const name = capitalizeWords(jsonData.name);
		const student = await userModel.create({
			admissionNo: data.get("admissionNo"),
			picture: photoUrl || "",
			subject: jsonData["subject[]"],
			name,
		});
		const response = {
			...student.toJSON(),
			subjects: student?.subject?.join(","),
		};
		console.log(response);
		return NextResponse.json({ message: photoUrl?"Student added successfuly":"Student add but image not uploaded." , data: response,success:photoUrl?true:false },{status: 200});
	} catch (error) {
		console.log(error);

		return NextResponse.json({ message: "not done",success:false }, { status: 500 });
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
							input: "$subject",
							initialValue: "",
							in: { $concat: ["$$value", ",", "$$this"] },
						},
					},
				},
			},
			{
				$project: {
					name: 1,
					admissionNo: 1,
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
