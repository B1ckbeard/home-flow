import mongoose from "mongoose";

const IndicationValueSchema = new mongoose.Schema({
  meterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const IndicationSchema = new mongoose.Schema(
  {
    object: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Object",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    values: [IndicationValueSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Indication", IndicationSchema);
