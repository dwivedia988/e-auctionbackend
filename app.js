import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import "./models/connection.js";

dotenv.config();
var app = express();

const PORT = process.env.PORT || 3001;

//to link router
import UserRouter from "./routes/user.router.js";
import CategoryRouter from "./routes/category.router.js";
import SubCategoryRouter from "./routes/subcategory.router.js";
import ProductRouter from "./routes/product.router.js";
import BidRouter from "./routes/bid.router.js";
import Gateway from "./controller/gateway.controller.js";

app.use(cors());

app.use(fileUpload());
//configuration to fetch req body content : body parser middleware
//used to fetch req data from methods like : POST , PUT , PATCH , DELETE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//route level middleware to load specific task
app.use("/user", UserRouter);
app.use("/category", CategoryRouter);
app.use("/subcategory", SubCategoryRouter);
app.use("/product", ProductRouter);
app.use("/bid", BidRouter);
app.post("/payment", Gateway);

app.listen(PORT);
console.log(`Server invoked at Port no ${PORT}`);
