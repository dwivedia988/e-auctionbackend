import "../models/connection.js";
import jwt from "jsonwebtoken";
import rs from "randomstring";
import UserSchemaModel from "../models/user.model.js";
import SendEmail from "./email.controller.js";

export var save = async (req, res, next) => {
  var userList = await UserSchemaModel.find();
  var l = userList.length;
  var _id = l == 0 ? 1 : userList[l - 1]._id + 1;
  var userDetails = {
    ...req.body,
    _id: _id,
    status: 0,
    role: "user",
    info: Date(),
  };
  try {
    var user = await UserSchemaModel.create(userDetails);
    SendEmail(user.name, user.email, user.password);
    res.status(201).json({ status: "User Register Successfully..." });
  } catch (error) {
    res.status(500).json({ status: error.message });
  }
};

export var login = async (req, res, next) => {
  var condition_obj = { ...req.body, status: 1 };
  var userDetails = await UserSchemaModel.findOne(condition_obj);
  if (userDetails) {
    var payload = { subject: userDetails.email };
    var key = rs.generate();
    var token = jwt.sign(payload, key);
    res.status(200).json({ token: token, userDetails: userDetails });
  } else res.status(404).json({ token: "error" });
};

export var fetch = async (req, res, next) => {
  // console.log(req.query.condition_obj);
  var condition_obj = req.query.condition_obj;
  // var condition_obj = JSON.parse(req.query.condition_obj);
  var userDetails = await UserSchemaModel.find(condition_obj);
  if (userDetails.length > 0) res.status(200).json(userDetails);
  else res.status(500).json({ response: "Requested resource not found...." });
};

export var deleteUser = async (req, res, next) => {
  var condition_obj = req.body;
  var userDetails = await UserSchemaModel.find(condition_obj);
  if (userDetails.length > 0) {
    var user = await UserSchemaModel.deleteMany(condition_obj);
    if (user.deletedCount > 0)
      res.status(200).json({ response: "User deleted successfully" });
    else res.status(500).json({ response: "server error" });
  } else res.status(404).json({ response: "Requested resource not found...." });
};

export var update = async (req, res, next) => {
  var condition_obj = req.body.condition_obj;
  var content_obj = req.body.content_obj;
  var userDetails = await UserSchemaModel.find(condition_obj);
  if (userDetails.length > 0) {
    var user = await UserSchemaModel.updateMany(condition_obj, {
      $set: content_obj,
    });

    if (user.modifiedCount > 0)
      res.status(200).json({ response: "User updated successfully" });
    else
      res.status(500).json({ response: "Server Error", status: error.message });
  } else res.status(404).json({ response: "Requested resource not found...." });
};
