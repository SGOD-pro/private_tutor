import { capitalizeWords } from "@/utils/Capitalize";
import { cloudinaryUTIL } from "@/utils/Cloudinary";
import fs from "fs";
import { promisify } from "util";
import ConnectDB from "@/db";
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
import userModel from "@/models/UserModel";
import { formDataToJson } from "../setStudent/route";

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
		const exists = await userModel.findOne({
			admissionNo: data.get("admissionNo"),
		});
		if (exists) {
			return Response.json(
				{ message: "Already student exists.", success: false },
				{ status: 400 }
			);
		}
		let photoUrl;
		if (file instanceof File) {
			const buffer = await file.arrayBuffer();

			const filePath = "./public/" + file.name;
			await writeFileAsync(filePath, Buffer.from(buffer));

			console.log("file path", filePath);

			const uploadedFile: any = await cloudinaryUTIL(filePath);
			console.log(uploadedFile);

			if (filePath) {
				await unlinkAsync(filePath);
			}
			photoUrl = uploadedFile?.url;
		}
		const name = capitalizeWords(jsonData.name);
		const user = await userModel.findByIdAndUpdate(_id, {
			$set: {

            },
		});
	} catch (error) {}
}
