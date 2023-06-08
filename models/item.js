const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, minLength:5, maxLength: 50 },
  description: { type: String, required: true,minLength:5, maxLength: 200 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true, min: 1 },
  stock: { type: Number, required: true, min: 1 },
});

ItemSchema.virtual("url").get(function () {
  return `/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
