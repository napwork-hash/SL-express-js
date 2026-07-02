import express from "express";
import {
    getGempa
} from "../controller/bmkg/index.js";

const router = express.Router();

router.get("/gempa", getGempa);

export default router;