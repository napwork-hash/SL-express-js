import express from "express";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById
} from "../controller/product/index.js";
import { parsePrice, validateProduct } from "../middleware/index.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", parsePrice, validateProduct, createProduct);
router.put("/:id", parsePrice, updateProduct);
router.delete("/:id", deleteProduct);

export default router;