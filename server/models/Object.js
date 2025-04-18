import mongoose from "mongoose";

const ObjectSchema = new mongoose.Schema(
  {
    name: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    indications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Indication'
      }
    ]
  }
);

export default mongoose.model('Object', ObjectSchema);
