import mongoose from "mongoose";
export const connectDb= async()=>{
    try {
        const connection= await mongoose.connect(process.env.MONGODB_URI!)
        console.log(`Database connected successfully: ${connection.connection.host}`)
    } catch (error) {
        console.log(`Error connecting to database: ${error}`)
        process.exit(1)
    }
}

export default connectDb;