const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User required"],
      minlength: [3, "User name is too short"],
      maxlength: [50, "User name is too long"],
      lowercase: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [5, "Too short password"],
      trim: true,
    },

    passwordChangedAt: Date,
    passwordVerifyCode: String,
    passwordVerifyExpires: Date,
    passwordVerifed: Boolean,

    phone: { type: String, trim: true },
    profileImage: String,
    roles: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    // child reference one to many
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },

  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.profileImage) {
    if (doc.profileImage.startsWith("http")) return;
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;

    doc.profileImage = imageUrl;
  }
};
//  get , get all , update
userSchema.post("init", (doc) => setImageUrl(doc));
// create
userSchema.post("save", (doc) => setImageUrl(doc));

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
