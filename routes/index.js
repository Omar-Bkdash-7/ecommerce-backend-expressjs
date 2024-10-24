const user = require("./user");
const category = require("./category");
const subcategory = require("./subcategory");
const brand = require("./brand");
const product = require("./product");
const auth = require("./auth");
const review = require("./review");
const wishlist = require("./wishlist");
const address = require("./address");
const coupon = require("./coupon");
const cart = require("./cart");
const order = require("./order");

const mountRoutes = (app) => {
  app.use("/api/category", category);
  app.use("/api/subcategory", subcategory);
  app.use("/api/brand", brand);
  app.use("/api/product", product);
  app.use("/api/users", user);
  app.use("/api/auth", auth);
  app.use("/api/reviews", review);
  app.use("/api/wishlist", wishlist);
  app.use("/api/addresses", address);
  app.use("/api/coupons", coupon);
  app.use("/api/cart", cart);
  app.use("/api/orders", order);
};

module.exports = mountRoutes;
