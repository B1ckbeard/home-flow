import mongoose from "mongoose";

const IndicationSchema = new mongoose.Schema(
  { 
    object: { type: mongoose.Schema.Types.ObjectId, ref: 'Object' },
    date: String,
    el: Number,
    water: Number
  }
);

export default mongoose.model('Indication', IndicationSchema);
