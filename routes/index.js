import express from "express";
import productRoute from "./product.js";

const router = express.Router();

router.use("/api/product", productRoute);

router.use('/', express.static('public'));

export default router;