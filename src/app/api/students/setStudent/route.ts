import userModel from "@/models/UserModel";
import { NextResponse, NextRequest } from "next/server";
import { capitalizeWords } from "@/utils/Capitalize";
import { cloudinaryUTIL } from "@/utils/Cloudinary";
import fs from "fs";
import { promisify } from "util";
import ConnectDB from "@/db";
ConnectDB();
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

function formDataToJson(formData: FormData) {
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
export async function POST(req: NextRequest) {
	try {
		const data = await req.formData();
		const file = data.get("picture");
		
		let photoUrl;
		if (file instanceof File) {
			const buffer = await file.arrayBuffer();

			const filePath = "./public/" + file.name;
			await writeFileAsync(filePath, Buffer.from(buffer));

			console.log("file path",filePath);

			const uploadedFile: any = await cloudinaryUTIL(filePath);
			console.log(uploadedFile);

			if (filePath) {
				await unlinkAsync(filePath);
			}
			photoUrl = uploadedFile.url;
		}
		const jsonData = formDataToJson(data);
		const name = capitalizeWords(jsonData.name);
		const student = await userModel.create({
			admissionNo: data.get("admissionNo"),
			picture: photoUrl || "",
			subject: jsonData["subject[]"],
			//batch: data.get("batch[name]"),
			name,
		});
		console.log(student);

		return NextResponse.json({ message: "done", data:student});
	} catch (error) {
		console.log(error);

		return NextResponse.json({ message: "not done" });
	}
}
