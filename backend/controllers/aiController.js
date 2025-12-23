import GROQ from "groq-sdk";
import Recipe from "../models/Recipe.js";
import { tavily } from "@tavily/core";
const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});
const groqClient = new GROQ({
  apiKey: process.env.GROQ_API_KEY,
});

const tools = [
  {
    type: "function",
    function: {
      name: "search_recipe_image",
      description: "Search for recipe images based on a query",
      parameters: {
        type: "object",
        properties: {
          recipeName: {
            type: "string",
          },
          cuisine: {
            type: "string",
          },
        },
        required: ["recipeName"],
      },
    },
  },
];

const toolHandlers = {
  search_recipe_image: async ({ recipeName, cuisine }) => {
    const query = `${recipeName} ${cuisine || ""} food dish`;

    const result = await tvly.search(query,{
      
      includeImages: true,
      max_results: 5,
    });

    return {
      imageUrl:
        result?.images?.[0] ||
        result?.results.find((r) => r.image)?.image ||
        "",
    };
  },
};

const runWithTools = async (options) => {
  let response = await groqClient.chat.completions.create({
    ...options,
    tools,
    tool_choice: "auto",
  });

  let message = response?.choices[0]?.message;

  while (message?.tool_calls?.length) {
    for (let call of message.tool_calls) {
      const handler = toolHandlers[call.function.name];
      const args = JSON.parse(call.function.arguments);
      const toolResult = await handler(args);

      options.messages.push(message);
      options.messages.push({
        tool_call_id: call.id,
        role: "tool",
        name: call.function.name,
        content: JSON.stringify(toolResult),
      });
    }

    response = await groqClient.chat.completions.create({
      ...options,
      response_format: {
        type: "json_object",
      },
    });

    message = response?.choices[0]?.message;
  }
  return message.content;
};
const JSONFormatExample = `
{
  "name": "Recipe name",
  "cuisine": "Cuisine type",
  "prepTimeMinutes": number,
  "cookTimeMinutes": number,
  "difficulty": "easy/medium/hard",
  "ingredients": ["ingredient1", "ingredient2"],
  "instructions": ["Step-by-step instructions"],
  "tags": ["tag1", "tag2"],
  "isVegetarian": true/false,
  "calories": number,
  "servings": number,
  "imageUrl": "URL of a suitable image"
}

example:
"suggestions": [
        {
            "name": "Paneer and Bell Pepper Curry",
            "cuisine": "Indian",
            "prepTimeMinutes": 20,
            "cookTimeMinutes": 25,
            "difficulty": "medium",
            "ingredients": [
                "paneer",
                "bell peppers",
                "spices"
            ],
            "instructions": [
                "1. Heat oil in a pan over medium heat (350°F/175°C).",
                "2. Add spices and sauté for 1 minute.",
                "3. Add bell peppers and cook until tender.",
                "4. Add paneer and stir well.",
                "5. Serve hot."
            ],
            "tags": [
                "vegetarian",
                "curry"
            ],
            "isVegetarian": true,
            "calories": 400,
            "servings": 4,
            "imageUrl": "https://i.pinimg.com/originals/34/d8/a7/34d8a71525ab8fc7514922328a54a206.jpg"
        },
        {
            "name": "Paneer and Bell Pepper Stir Fry",
            "cuisine": "Indian",
            "prepTimeMinutes": 15,
            "cookTimeMinutes": 15,
            "difficulty": "medium",
            "ingredients": [
                "paneer",
                "bell peppers",
                "spices"
            ],
            "instructions": [
                "1. Heat oil in a wok over high heat (450°F/230°C).",
                "2. Add spices and stir fry for 1 minute.",
                "3. Add bell peppers and cook until tender.",
                "4. Add paneer and stir well.",
                "5. Serve hot."
            ],
            "tags": [
                "vegetarian",
                "stir fry"
            ],
            "isVegetarian": true,
            "calories": 350,
            "servings": 3,
            "imageUrl": "https://i.pinimg.com/originals/34/d8/a7/34d8a71525ab8fc7514922328a54a206.jpg"
        }
    ],
`;

// -------------------- Safe JSON Parse --------------------
const safeParseJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    return null;
  }
};

// -------------------- Suggest Recipes --------------------
// @desc    Get recipe suggestions based on ingredients
// @route   POST /api/ai/suggest
const suggestRecipe = async (req, res) => {
  try {
    const {
      ingredients,
      cuisine,
      difficulty,
      prepTime,
      mealType,
      isVegetarian = true,
    } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of ingredients",
      });
    }

    let prompt = "";
    if (ingredients.length === 0) {
      prompt = `Suggest 3 popular recipes${
        cuisine ? ` from ${cuisine} cuisine` : ""
      }. The cuisine should be ${
        isVegetarian ? "vegetarian" : "non-vegetarian"
      }.
      Cuisine MUST be exactly one of the following values:
Indian, Italian, Chinese, Mexican, Mediterranean, Japanese, Thai,
American, French, Spanish, Korean, Vietnamese, Middle Eastern, Greek, Other

Do NOT invent new cuisines.
If unsure, use "Other".
Return a **JSON array** only, following this structure:
    ${JSONFormatExample}

Requirements:
1. Include temperatures in both Fahrenheit (°F) and Celsius (°C) when applicable.
2. Use realistic values for calories and servings.
3. Return only JSON, no extra text.
4. Strictly follow the specified format.
`;
    } else {
      prompt = `Given these ingredients: ${ingredients.join(
        ", "
      )}, suggest 2 creative recipes${
        cuisine ? ` from ${cuisine} cuisine` : ""
      }${mealType ? ` for ${mealType}` : ""}.
      Cuisine MUST be exactly one of the following values:
Indian, Italian, Chinese, Mexican, Mediterranean, Japanese, Thai,
American, French, Spanish, Korean, Vietnamese, Middle Eastern, Greek, Other

Do NOT invent new cuisines.
If unsure, use "Other".
Include all provided ingredients. Difficulty: ${
        difficulty || "medium"
      }, Preparation time: ${prepTime || "Under 60"} minutes.
Return a **JSON array** only, following this structure:
    ${JSONFormatExample}
Return a **JSON array** only, same structure as above.
1. Provide temperatures in both Fahrenheit (°F) and Celsius (°C).
2. Use realistic values for calories and servings.
3. Return only JSON, no extra text.`;
    }

    const chatCompletion = await runWithTools({
      messages: [
        {
          role: "system",
          content:
            "You are a professional chef and recipe expert. Always respond with valid JSON. If you do not already know a real image URL, you MUST call the tool search_recipe_image. Do NOT invent image URLs.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    const aiResponse = safeParseJSON(chatCompletion
    );

    return res.json({
      success: true,
      message:
        ingredients.length === 0
          ? "Popular recipe suggestions"
          : `Recipes suggested for: ${ingredients.join(", ")}`,
       suggestions:aiResponse.suggestions,
      tip: "You can save any of these recipes to your collection",
      usage: chatCompletion.usage,
    });
  } catch (error) {
    console.error("AI Suggestion Error:", error);
    return res.status(500).json({
      success: false,
      message: "AI service temporarily unavailable",
      suggestions: [],
      error: error.message,
    });
  }
};

// -------------------- Simplify Recipe --------------------
// @desc    Simplify recipe instructions
// @route   POST /api/ai/simplify/:recipeId
const simplifyRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { complexity = "beginner", language = "english" } = req.body;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    // Escape quotes and backslashes in recipe text
    const sanitizedInstructions = recipe.instructions
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');

    const prompt = `Simplify the following recipe instructions for a ${complexity} level cook:

Original instructions: "${sanitizedInstructions}"

Requirements:
1. Break down into clear, numbered steps
2. Use simple language
3. Add helpful tips for ${complexity} cooks
4. Include estimated time for each step
5. Highlight safety tips
6. Format in ${language}

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "simplifiedInstructions": "<full instructions in simple language>",
  "steps": [
    {
      "stepNumber": <number>,
      "description": "<step instructions>",
      "timeMinutes": <number>,
      "tip": "<helpful tip>"
    }
  ],
  "totalSimplifiedTime": <number>,
  "complexityLevel": "<complexity>"
}
Do not include any extra text or commentary.`;

    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a cooking instructor that simplifies complex recipes for home cooks.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const simplifiedResponse = safeParseJSON(
      chatCompletion.choices[0]?.message?.content
    ) || {
      simplifiedInstructions: recipe.instructions,
      steps: [],
      totalSimplifiedTime: recipe.prepTimeMinutes,
      complexityLevel: complexity,
    };

    return res.json({
      success: true,
      originalRecipe: {
        name: recipe.name,
        instructions: recipe.instructions,
        prepTime: recipe.prepTimeMinutes,
      },
      simplified: simplifiedResponse,
      complexity,
      language,
      usage: chatCompletion.usage,
    });
  } catch (error) {
    console.error("AI Simplify Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to simplify recipe instructions",
      error: error.message,
    });
  }
};

// -------------------- Generate Recipe --------------------
// @desc    Generate recipe from AI description
// @route   POST /api/ai/generate
const generateRecipe = async (req, res) => {
  try {
    const {
      description,
      cuisine,
      mealType,
      dietaryRestrictions,
      isVegetarian = true,
    } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Please provide a recipe description",
      });
    }

    const prompt = `Create a detailed recipe based on this description: "${description}".
${cuisine ? `Cuisine: ${cuisine}` : ""}
The cuisine should be ${isVegetarian ? "vegetarian" : "non-vegetarian"}
Cuisine MUST be exactly one of the following values:
Indian, Italian, Chinese, Mexican, Mediterranean, Japanese, Thai,
American, French, Spanish, Korean, Vietnamese, Middle Eastern, Greek, Other

Do NOT invent new cuisines.
If unsure, use "Other".
${mealType ? `Meal type: ${mealType}` : ""}
${dietaryRestrictions ? `Dietary restrictions: ${dietaryRestrictions}` : ""}

Return a **single JSON object** with this exact format:
{
  "name": "Recipe name",
  "cuisine": "Cuisine type",
  "isVegetarian": true/false,
  "prepTimeMinutes": number,
  "cookTimeMinutes": number,
  "servings": number,
  "ingredients": ["ingredient1", "ingredient2"],
  "instructions": ["Step-by-step instructions"],
  "difficulty": "easy/medium/hard",
  "tags": ["tag1", "tag2"],
  "imageUrl": "URL of a suitable image",
  "calories": number,
  "createdBy": "System",
}

example:
{
  "name": "Vegetable Stir Fry",
  "cuisine": "Chinese",
  "prepTimeMinutes": 15,
  "cookTimeMinutes": 10,
  "difficulty": "easy",
  "ingredients": ["Broccoli", "Carrot", "Bell Pepper", "Soy Sauce", "Garlic"],
  "instructions": ["1. Chop veggies.", "2. Stir fry in wok with garlic and soy sauce."],
  "tags": ["vegetarian", "quick", "healthy"],
  "isVegetarian": true,
  "calories": 250,
  "servings": 2,
  "imageUrl": "https://example.com/veg-stir-fry.jpg"
}

Use realistic values for calories and rating. Return only valid JSON, no extra text.`;

    const chatCompletion = await runWithTools({
      messages: [
        {
          role: "system",
          content:
            "You are a creative chef that generates original recipes based on descriptions.If you do not already know a real image URL, you MUST call the tool search_recipe_image. Do NOT invent image URLs.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
    });

    const generatedRecipe = safeParseJSON(chatCompletion
    ) || {
      name: "AI Generated Recipe",
      cuisine: cuisine || "Unknown",
      isVegetarian: false,
      prepTimeMinutes: 0,
      cookTimeMinutes: 0,
      servings: 1,
      ingredients: [],
      instructions: "Failed to parse AI response. Please try again.",
      difficulty: "medium",
      tags: [],
      imageUrl: "",
      calories: 0,
      createdBy: "System",
      isFavorite: false,
      rating: 0,
    };

    return res.json({
      success: true,
      message: "Recipe generated successfully",
      recipe: generatedRecipe,
      usage: chatCompletion.usage,
    });
  } catch (error) {
    console.error("AI Generate Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate recipe",
      error: error.message,
    });
  }
};

// -------------------- Analyze Nutrition --------------------
// @desc    Analyze recipe nutrition
// @route   GET /api/ai/analyze/:recipeId
const analyzeNutrition = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe)
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });

    const prompt = `Analyze the nutritional content of this recipe:

Recipe: ${recipe.name}
Ingredients: ${recipe.ingredients.join(", ")}
Instructions: ${recipe.instructions}

Return a **JSON object** with:
{
  "estimatedCalories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "fiber": number,
  "keyNutrients": ["nutrient1", "nutrient2"],
  "healthBenefits": ["benefit1", "benefit2"],
  "dietaryTags": ["high-protein", "low-carb", etc.],
  "suggestionsForImprovement": ["tip1", "tip2"]
}

Return only valid JSON.`;

    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a nutritionist who analyzes recipes for their nutritional content.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const nutritionAnalysis = safeParseJSON(
      chatCompletion.choices[0]?.message?.content
    ) || {
      estimatedCalories: 0,
      message: "Nutrition analysis unavailable",
    };

    return res.json({
      success: true,
      recipeName: recipe.name,
      analysis: nutritionAnalysis,
      usage: chatCompletion.usage,
    });
  } catch (error) {
    console.error("AI Nutrition Analysis Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze nutrition",
      error: error.message,
    });
  }
};

export { suggestRecipe, simplifyRecipe, generateRecipe, analyzeNutrition };
