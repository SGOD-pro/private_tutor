import mongoose, { Connection } from "mongoose";
type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};
export default async function ConnectDB() {
	if (connection.isConnected) {
		console.log("Mongoose is already connected.");
		return;
	}
	try {
		const connnect = await mongoose.connect(process.env.MONGO_URI!);
		mongoose.connection.on("connection", () => {
			console.log("MongoDb connected");
			connection.isConnected = connnect.connections[0].readyState;
		});
		mongoose.connection.on("error", () => {
			console.log("MongoDb not connected.");
		});
	} catch (error) {
		console.log("Server error: " + error);
	}
}
