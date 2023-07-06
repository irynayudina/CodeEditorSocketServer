import mongoose from "mongoose";

const documentSchema = mongoose.Schema({
  _id: String,
  data: Object,
});

const Document = mongoose.model('Document', documentSchema);

export default Document;