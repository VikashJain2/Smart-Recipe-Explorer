import express from "express";
import {
  checkEmpty,
  createRecipe,
  getRecipeById,
  getRecipes,
} from "../controllers/recipeController.js";
const router = express.Router();

router.get("/", getRecipes);
router.get("/get-by-id/:id", getRecipeById);
router.post("/", createRecipe);
router.get("/check-empty", checkEmpty)
export default router;
