const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const ApiError = require("./utils/api-error");
const globalError = require("./middleware/error");

// route
const mountRoutes = require("./routes");
const { webhookCheckout } = require("./services/order");

dotenv.config({ path: "config.env" });

// Express app
const app = express();

// Enable other domain to access my application
app.use(cors());
app.options("*", cors());

// To compression all responses
app.use(compression());

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// Middleware
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`-------------------------------------`);
  console.log(`${process.env.STRIPE_SECRET}`);
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

// Apply the rate limiting middleware to all requests
app.use("/api", limiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

// MongoDB
require("./config/db")();

// Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`App listening on port ${PORT}`)
);

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection ERROR: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down server...");
    process.exit(1);
  });
});
