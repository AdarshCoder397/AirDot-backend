const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/productController");
const {isAuthUser,authorizeRoles} = require("../middleware/auth");

const router = express.Router();
if (isAuthUser) {
  router.route("/products").get(getAllProducts);
}
router.route("/product/new").post(isAuthUser, authorizeRoles("admin"),createProduct);
router
  .route("/product/:id")
  .put(isAuthUser, authorizeRoles("admin"),updateProduct)
  .delete(isAuthUser, authorizeRoles("admin"),deleteProduct)
  .get(getProductDetails);

module.exports = router;
