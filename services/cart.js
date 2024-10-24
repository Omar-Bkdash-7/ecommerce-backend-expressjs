const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/api-error");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");

const calculateTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItmes.forEach((item) => {
    totalPrice += item.price;
    return totalPrice;
  });
  cart.totalPriceAfterDiscount = undefined;
  cart.totalPrice = totalPrice;
};

// @desc Add product to cart
// @route POST /api/cart
// @access Private/User
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity, color } = req.body;
  // To get price of product
  const product = await Product.findById(productId);

  if (!product) {
    return next(
      new ApiError(`This product by ID : ${productId} not exist.`, 404)
    );
  }
  if (quantity > product.quantity) {
    return next(
      new ApiError(
        `No quantity is available , Available quantity : ${quantity}`,
        404
      )
    );
  }
  // Get cart for logged uer
  let cart = await Cart.findOne({ user: req.user._id });

  const newProduct = {
    product: productId,
    price: product.price * quantity,
    color,
    quantity,
  };

  if (!cart) {
    // Create new cart if not exist
    cart = await Cart.create({
      user: req.user._id,
      cartItmes: [newProduct],
    });
  } else {
    // Check if product is exist at same color.
    const productIndex = cart.cartItmes.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    // If exist , Sum new quantity to prevuios quantity
    if (productIndex > -1) {
      const updateItem = cart.cartItmes[productIndex];
      updateItem.quantity += quantity;
      updateItem.price += quantity * product.price;
      cart.cartItmes[productIndex] = updateItem;
    } else {
      // If not exist in cart , Push a new Product to cart
      cart.cartItmes.push(newProduct);
    }
  }

  calculateTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    message: "Success",
    numberOfProduct: cart.cartItmes.length,
    cart: cart,
  });
});

// @desc Get logged user cart
// @route GET /api/cart
// @access Private/User
exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart)
    return next(
      new ApiError(`This user : ${req.user._id} do not have cart.`, 404)
    );
  cart.totalPriceAfterDiscount = undefined;
  res.status(200).json({
    status: "Success",
    numberOfProduct: cart.cartItmes.length,
    cart: cart,
  });
});

// @desc Remove product from cart
// @route DELETE /api/cart/:productId
// @access Private/user
exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItmes: { _id: productId } },
    },
    { new: true }
  );

  calculateTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "Success",
    cart: cart,
    numberOfProduct: cart.cartItmes.length,
  });
});

// @desc Remove all product from cart
// @route PUT /api/cart
// @access Private/user
exports.removeAllProductsFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.cartItmes = [];
  await cart.save();
  cart.totalPriceAfterDiscount = undefined;
  res.status(200).json({
    status: "Success",
    cart: cart,
    numberOfProduct: cart.cartItmes.length,
  });
});

// @desc Clear cart
// @route DELETE /api/cart
// @access Private/user
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(200).json({
    status: "Success",
  });
});

// @desc Apply coupon on cart
// @route PUT /api/cart/apply-coupon
// @access Private/user
exports.applyCouponOnCart = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon)
    return next(
      new ApiError(
        `No coupon by this name : ${req.body.coupon} or coupon is expired`
      )
    );

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart)
    return next(
      new ApiError(`This user : ${req.user._id} do not have cart.`, 404)
    );

  let { totalPrice } = cart;
  totalPrice -= (totalPrice * coupon.discount) / 100;
  cart.totalPriceAfterDiscount = totalPrice.toFixed(2);
  await cart.save();
  res.status(200).json({
    status: "Success",
    numberOfProduct: cart.cartItmes.length,
    cart: cart,
  });
});
