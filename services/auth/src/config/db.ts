import mongoose from 'mongoose';

const connectDB= async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI as string,{
            dbName:"DELIVERY_APP",
        })
        console.log("MongoDB conneted sucessfully::✅")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
export default connectDB;