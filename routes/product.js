import express from "express";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById
} from "../controller/product/index.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;