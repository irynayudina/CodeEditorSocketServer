const { Schema, model, ObjectId } = require("mongoose");

const Document = new Schema({
  _id: String,
  data: Object,
  // projectName: {
  //   type: String,
  //   required: true,
  // },
  // projectId: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  // associatedUsers: [
  //   {
  //     type: ObjectId,
  //     ref: "User",
  //   },
  // ],
  // connectedUsers: [
  //   {
  //     type: ObjectId,
  //     ref: "User",
  //   },
  // ],
});

module.exports = model("Document", Document)
