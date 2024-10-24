const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      minlength: [3, "Category name is too short"],
      maxlength: [255, "Category name is too long"],
      unique: [true, "Category must be unique"],
    },
    // A and B => a-and-b //! this exist in url after <com/>
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
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
//  get , get all , update
categorySchema.post("init", (doc) => setImageUrl(doc));
// create
categorySchema.post("save", (doc) => setImageUrl(doc));

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
