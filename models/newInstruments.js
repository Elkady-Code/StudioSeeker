const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newInstrumentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: false }],
  },
  {
    timestamps: true,
  }
);

const NewInstrument = mongoose.model("NewInstrument", newInstrumentSchema);
module.exports = NewInstrument;
