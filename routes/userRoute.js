import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

router.route("/").post(registerUser);
router.post("/login", authUser);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

export default router;