import mongoose from "mongoose";

export default async function ConnectDB() {
    try {
        const connnect=mongoose.connect(process.env.MONGO_URI!)
        mongoose.connection.on('connection',()=>{
            console.log("MongoDb connected");
            
        })
        mongoose.connection.on('error',()=>{
            console.log("MongoDb not connected.");
        })
    } catch (error) {
        console.log("Server error: " + error);
    }
}