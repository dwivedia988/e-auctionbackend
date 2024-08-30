import "../models/connection.js";
import ProductSchemaModel from "../models/product.model.js";
import url from "url";
import path from "path";
import rs from "randomstring";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export var save = async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.files);
  var productlist = await ProductSchemaModel.find();
  var len = productlist.length;
  var _id = len == 0 ? 1 : productlist[len - 1]._id + 1;

  var producticon = req.files.producticon;
  var producticonnm =
    Date.now() + "-" + rs.generate(20) + "-" + producticon.name;

  var uploadpath = path.join(
    __dirname,
    "../../UI/public/assets/uploads/producticon",
    producticonnm
  );

  var ProductDetails = {
    ...req.body,
    piconnm: producticonnm,
    _id: _id,
    info: Date(),
  };
  if (ProductDetails) {
    var product = await ProductSchemaModel.create(ProductDetails);
    producticon.mv(uploadpath);
    res.status(201).json({ status: "Product inserted successfully" });
  } else res.status(500).json({ response: "server error" });
};

export var fetch = async (req, res, next) => {
  var condition_obj = req.query.condition_obj;
  var productDetails = await ProductSchemaModel.find(condition_obj);
  if (productDetails.length > 0) res.status(200).json(productDetails);
  else res.status(404).json({ response: "Requested response not found...." });
};

export var deleteProduct = async (req, res, next) => {
  var condition_obj = req.body;
  var productDetails = await ProductSchemaModel.find(condition_obj);
  if (productDetails.length > 0) {
    var product = await ProductSchemaModel.deleteMany(condition_obj);
    if (product.deletedCount > 0)
      res.status(200).json({ response: "Product deleted Successfully.." });
    else res.status(500).json({ response: "server error" });
  } else res.status(404).json({ response: "Requested response not found...." });
};

export var update = async (req, res, next) => {
  var condition_obj = JSON.parse(req.body.condition_obj);
  var productDetails = await ProductSchemaModel.find(condition_obj);
  if (productDetails.length > 0) {
    var product = await ProductSchemaModel.updateMany(
      JSON.parse(req.body.condition_obj),
      { $set: JSON.parse(req.body.content_obj) }
    );
    if (product)
      res.status(200).json({ response: "Product updated Successfully.." });
    else res.status(500).json({ response: "server error" });
  } else res.status(404).json({ response: "Requested response not found...." });
};
