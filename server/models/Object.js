// models/Object.js
import mongoose from "mongoose";

const MeterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["electricity", "water", "gas", "other"],
      default: "other",
    },
    rate: {
      type: Number,
      default: 0,
    },
    hasSewage: {
      type: Boolean,
      default: false,
    },
    sewageRate: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: true,
    timestamps: false,
  },
);

const ObjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    meters: [MeterSchema],
    indications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Indication",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Object", ObjectSchema);
