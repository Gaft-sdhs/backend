import express from "express";
import { get_regular_glasses, login, send_random, signUp } from "../controller/controller.js";

const router = express.Router();

router.route("/signUp").post(signUp);
router.route("/login").post(login);
router.route("/getGlasses").get(get_regular_glasses);
router.route("/random_glasses").get(send_random);
export default router;