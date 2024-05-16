import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import batchModel from "@/models/Batches";
import userModel from "@/models/UserModel";

function getAdjustedHourAndDay() {
	let now = new Date();

	let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
	let currentDay = daysOfWeek[now.getDay()];
	let currentHour = now.getHours();
	let currentMinute = now.getMinutes();

	let adjustedHour;
	if (currentMinute > 30) {
		adjustedHour = (currentHour + 1) % 24;
	} else {
		adjustedHour = currentHour;
	}
	let adjustedTime = currentHour.toString().padStart(2, "0") + ":00";

	// Combine the day and adjusted time

	return { currentDay, adjustedTime };
}

export async function GET() {
	await ConnectDB();
	try {
		const { currentDay, adjustedTime } = getAdjustedHourAndDay();
		const batch = await batchModel.aggregate([
			{ $match: { endTime: {$lt:adjustedTime}, days: currentDay  } },
		]);
		console.log(currentDay, adjustedTime);

		console.log(batch[0]);
if (batch.length===0) {
		return Response.json({ success: false, message: "Cann't get any batch!" },{status:202});
    
}
		const users = await userModel.find({batches :batch[0]._id});

		return Response.json({ success: true, users, message: "Done!" });
	} catch (error) {}
}
