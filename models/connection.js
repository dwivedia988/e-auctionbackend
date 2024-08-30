import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
// const url = "mongodb://127.0.0.1:27017/eAuction-6aug";
// const URL =
//   "mongodb+srv://dwivedia988:Adarsh8349@cluster0.ufh31.mongodb.net/e-auction?retryWrites=true&w=majority&appName=Cluster0";
const URL = process.env.NODE_APP_DATABASE_URL;
// console.log(URL);
mongoose.connect(URL);
console.log("Successfully connected to mongodb database...");
