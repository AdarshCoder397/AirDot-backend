const Order = require("../models/ordermodel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");

//Create New Order
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now,
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});

// Get single Order

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// Get loggedIn user Orders

exports.myOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    order,
  });
});

// Get All Orders - Admin

exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update Orders Status - Admin

exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }
  if (order.paymentInfo.orderStatus === "Delivered") {
    return next(new ErrorHandler("Order Already Delivered!"), 400);
  }
  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });
  order.paymentInfo.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.devliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    order,
  });
  async function updateStock(id, quantity) {
    const product = await Product.findById(String(id));
    product.Stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }
});

// Delete Order - Admin

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }
  await order.remove();
  res.status(200).json({
    success: true,
  });
});
