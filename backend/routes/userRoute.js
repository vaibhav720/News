const express = require("express");
const { registerUser,loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser, personalNews, trending, newTopics } = require("../controllers/userController");
const { isAuthenticatesUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset").put(resetPassword);

router.route("/logout").post(logout);

router.route("/me").get(isAuthenticatesUser,getUserDetails);

router.route("/password/update").put(isAuthenticatesUser,updatePassword);

router.route("/me/update").put(isAuthenticatesUser,updateProfile);

router.route("/admin/users").get(isAuthenticatesUser, authorizeRoles("admin"), getAllUser);

router.route("/admin/users/:id").get(isAuthenticatesUser, authorizeRoles("admin"), getSingleUser).put(isAuthenticatesUser, authorizeRoles("admin"), updateUserRole).delete(isAuthenticatesUser, authorizeRoles("admin"), deleteUser);

router.route("/personalNews").get(isAuthenticatesUser,personalNews);

router.route("/trending").get(isAuthenticatesUser,trending);


router.route("/newTopics").put(isAuthenticatesUser,newTopics);

module.exports = router;