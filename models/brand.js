const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      minlength: [3, "Category name is too short"],
      maxlength: [255, "Category name is too long"],
      unique: [true, "Category must be unique"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    if (doc.image.startsWith("http")) return;
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;

    doc.image = imageUrl;
  }
};
//  get , get all , update
brandSchema.post("init", (doc) => setImageUrl(doc));
// create
brandSchema.post("save", (doc) => setImageUrl(doc));

module.exports = mongoose.model("Brand", brandSchema);
