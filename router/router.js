import express from "express";
import { get_regular_glasses, get_review, login, send_random, signUp, write_review } from "../controller/controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.route("/signUp").post(signUp);
router.route("/login").post(login);
router.route("/getGlasses").get(get_regular_glasses);
router.route("/random_glasses").get(send_random);
router.route("/writeReview").all(auth).post(write_review);
router.route("/get_review").all(auth).get(get_review)
export default router;