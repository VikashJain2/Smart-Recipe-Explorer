import Recipe from "../models/Recipe.js";

// @desc    Get all recipes with search and filters
// @route   GET /api/recipes
const getRecipes = async (req, res) => {
  try {
    const {
      search,
      cuisine,
      isVegetarian,
      maxTime,
      difficulty,
      tags,
      ingredients,
      minTime,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 12,
    } = req.query;
    let query = {};
    let sort = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (cuisine) query.cuisine = cuisine;

    if (isVegetarian !== undefined)
      query.isVegetarian = isVegetarian === "true";

    if (minTime || maxTime) {
      query.prepTimeMinutes = {};
      if (minTime) query.prepTimeMinutes.$gte = parseInt(minTime);
      if (maxTime) query.prepTimeMinutes.$lte = parseInt(maxTime);
    }

    if (difficulty) query.difficulty = difficulty;
    if (tags) {
      const tagList = tags.split(",").map((tag) => tag.toLowerCase().trim());
      query.tags = { $in: tagList };
    }

    if (ingredients) {
      const ingredientList = ingredients
        .split(",")
        .map((ing) => ing.toLowerCase().trim());
      query.ingredients = {
        $in: ingredientList.map((i) => new RegExp(i, "i")),
      };
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      name: { name: 1 },
      prepTime: { prepTimeMinutes: 1 },
      difficulty: { difficulty: 1 },
    };

    sort = sortOptions[sortBy] || { createdAt: -1 };
    if (order === "asc" && sortBy !== "createdAt") {
      sort = { [Object.keys(sort)[0]]: 1 };
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const totalRecipes = await Recipe.countDocuments(query);

    const recipes = await Recipe.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalCount = await Recipe.countDocuments();
    const isEmpty = totalCount === 0;

    return res.status(200).json({
      success: true,
      count: recipes.length,
      total: totalRecipes,
      totalPages: Math.ceil(totalRecipes / pageSize),
      currentPage: pageNumber,
      isEmpty,
      recipes,
    });
  } catch (error) {
    console.error("Get Recipes Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/get-by-id/:id
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    recipe.views += 1;
    await recipe.save();

    return res.json({
      success: true,
      recipe,
    });
  } catch (error) {
    console.log("Get Recipe By ID Error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid recipe ID",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Create new recipe
// @route   POST /api/recipes
const createRecipe = async (req, res) => {
  try {
    if (!req.body.name || !req.body.ingredients || !req.body.instructions) {
      return res.status(400).json({
        success: false,
        message: "Name, ingredients, and instructions are required",
      });
    }

    const recipe = new Recipe(req.body);
    await recipe.save();

    return res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      recipe,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Check if recipe collection is empty
// @route   GET /api/recipes/check-empty
const checkEmpty = async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    return res.status(200).json({
      success: true,
      isEmpty: count === 0,
      count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getRecipes, getRecipeById, createRecipe, checkEmpty };
