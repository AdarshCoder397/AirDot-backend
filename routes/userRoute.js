const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetail,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateRole,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();
const { isAuthUser, authorizeRoles } = require("../middleware/auth");

router.route("/register").post(registerUser);
router.route("/login").get(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/i").get(isAuthUser, getUserDetail);
router.route("/password/update").put(isAuthUser, updatePassword);
router.route("/i/update").put(isAuthUser, updateProfile);
router
  .route("/admin/users")
  .get(isAuthUser, authorizeRoles("admin"), getAllUser);
router
  .route("/admin/user/:id")
  .get(isAuthUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthUser, authorizeRoles("admin"), updateRole)
  .delete(isAuthUser, authorizeRoles("admin"), deleteUser)
  

module.exports = router;
