import express from "express";
import categoryController from "../../../controllers/category/_controller.category";

const router = express.Router();

router.get("/p", categoryController.readAllParents);
router.get("/c", categoryController.readChildsByParentId);
router.get("/", categoryController.readAllCategories);

export default router;
