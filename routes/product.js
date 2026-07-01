import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controller/product/index.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;