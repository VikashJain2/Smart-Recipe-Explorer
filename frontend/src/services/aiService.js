import {api} from "./api";

export const aiService = {
  suggestRecipe: async (ingredients, options = {}) => {
    console.log("Suggesting recipe with ingredients:", ingredients, "and options:", options);
    const response = await api.post("/ai/suggest", {
      ingredients,
      cuisine: options?.cuisine,
      difficulty: options?.difficulty,
      prepTime: options?.prepTime,
      mealType: options?.mealType,
      isVegetarian: options?.isVegetarian,
    });

    return response.data;
  },

  simplifyRecipe: async (recipeId, options = {}) => {
    const response = await api.post(`/ai/simplify/${recipeId}`, {
      complexity: options.complexity || "beginner",
      language: options.language || "english",
    });
    return response.data;
  },

  generateRecipe: async (description, options = {}) => {
    const response = await api.post("/ai/generate", {
      description,
      cuisine: options?.cuisine,
      mealType: options?.mealType,
      dietaryRestrictions: options?.dietaryRestrictions,
      isVegetarian: options?.isVegetarian,
    });
    return response.data;
  },

  analyzeNutrition: async (recipeId) => {
    const response = await api.get(`/ai/analyze/${recipeId}`);
    return response.data;
  },
};

export const parseAISuggestion = (suggestion) => {
  if (!suggestion) return null;

  try {
    let recipeData = suggestion;
    if (typeof suggestion === "string") {
      try {
        recipeData = JSON.parse(suggestion);
      } catch {
        recipeData = {
          name: "AI Suggested Recipe",
          instructions: suggestion,
          ingredients: [],
          prepTimeMinutes: 30,
          difficulty: "medium",
        };
      }
    }

    return {
      name: recipeData.name || "AI Suggested Recipe",
      cuisine: recipeData.cuisine || "Various",
      isVegetarian:
        recipeData.isVegetarian !== undefined ? recipeData.isVegetarian : true,
      prepTimeMinutes: recipeData.prepTimeMinutes || 30,
      cookTimeMinutes: recipeData.cookTimeMinutes || 30,
      servings: recipeData.servings || 2,
      ingredients: Array.isArray(recipeData.ingredients)
        ? recipeData.ingredients
        : (recipeData.ingredients || "").split(",").map((i) => i.trim()),
      instructions:
        recipeData.instructions || recipeData.simplifiedInstructions || "",

      difficulty: recipeData.difficulty || "medium",
      tags: Array.isArray(recipeData.tags)
        ? recipeData.tags
        : (recipeData.tags || "").split(",").map((t) => t.trim()),
      calories: recipeData.calories || 0,
      createdBy: "AI Assistant",
      imageUrl: recipeData.imageUrl
    };
  } catch (error) {
    console.error("Error parsing AI suggestion:", error);
    return null;
  }
};

export const validateAIResponse = (response) => {
  if (!response) return false;

  const hasValidStructure =
    (response.suggestions && Array.isArray(response.suggestions.recipes)) ||
    (response.recipe && typeof response.recipe === "object") ||
    (response.simplified && typeof response.simplified === "object");
  return hasValidStructure;
};
