import express from "express";
import productRoute from "./product.js";
import bmkgRoute from "./bmkg.js";
import { healthCheck } from "../controller/health/index.js";

const router = express.Router();

router.use("/api/product", productRoute);
router.use("/api/bmkg", bmkgRoute);
router.use("/health", healthCheck);

router.use('/', express.static('public'));

export default router;