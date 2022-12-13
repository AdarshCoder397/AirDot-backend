const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  CreateProductReview,
  getProductReviews,
  deleteProductReview,
} = require("../controllers/productController");
const { isAuthUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.route("/products").get(getAllProducts);
router
  .route("/admin/product/new")
  .post(isAuthUser, authorizeRoles("admin"), createProduct);
router
  .route("/admin/product/:id")
  .put(isAuthUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthUser, authorizeRoles("admin"), deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthUser,CreateProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthUser,deleteProductReview)

module.exports = router;
