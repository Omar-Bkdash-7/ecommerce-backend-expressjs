const express = require("express");
const AuthService = require("../services/auth");

const router = express.Router();

const {
  createCashOrder,
  getOrders,
  filterLoggged,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDeliver,
  checkoutSession,
} = require("../services/order");

router.use(AuthService.protect);

router.get(
  "/checkout-session/:cartId",
  AuthService.allowedTo("admin", "nanager"),
  checkoutSession
);

router.route("/:cartId").post(AuthService.allowedTo("user"), createCashOrder);

router
  .route("/")
  .get(
    AuthService.allowedTo("user", "admin", "nanager"),
    filterLoggged,
    getOrders
  );

router
  .route("/:id")
  .get(AuthService.allowedTo("admin", "nanager"), getOrderById);

router.put(
  "/:id/pay",
  AuthService.allowedTo("admin", "nanager"),
  updateOrderToPaid
);

router.put(
  "/:id/deliver",
  AuthService.allowedTo("admin", "nanager"),
  updateOrderToDeliver
);

module.exports = router;
