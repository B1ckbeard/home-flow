import mongoose from "mongoose";

const ObjectSchema = new mongoose.Schema({
  name: String,
});

export default mongoose.model('Object', ObjectSchema)
