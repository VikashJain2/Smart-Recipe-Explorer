import { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiMessageSquare,
  FiZap,
  FiClock,
  FiStar,
  FiCopy,
  FiSave,
  FiChevronRight,
} from "react-icons/fi";
import { aiService, parseAISuggestion } from "../services/aiService";
import { recipeApi } from "../services/api";
import {
  CUISINE_OPTIONS,
  AI_COMPLEXITY_OPTIONS,
  AI_LANGUAGE_OPTIONS,
  MEAL_TYPE_OPTIONS,
} from "../utils/constants";
import { toast } from "react-hot-toast";

const AIChatBox = ({ recipeId, onRecipeGenerated, standaloneMode = false }) => {
  const [isOpen, setIsOpen] = useState(standaloneMode);
  const [aiMode, setAiMode] = useState("suggest"); // 'suggest', 'simplify', 'generate', 'analyze'
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiOptions, setAiOptions] = useState({
    cuisine: "",
    difficulty: "",
    prepTime: "",
    mealType: "",
    complexity: "beginner",
    language: "english",
    isVegetarian: true,
  });

const samplePrompts = {
  suggest: [
    "potatoes, onions, tomatoes",
    "paneer, bell peppers, spices",
    "spinach, garlic, lentils",
    "mushrooms, capsicum, cheese",
    "chickpeas, onions, cumin",
  ],
  generate: [
    "a quick vegetarian pasta dish with vegetables",
    "a healthy vegetarian breakfast smoothie",
    "a festive vegetarian dessert for Diwali",
    "a high-protein vegetarian lunch for gym",
    "a simple vegan dinner with pantry ingredients",
  ],
};


  const handleAIAction = async () => {
    if (!input.trim() && aiMode === "suggest") {
      setError("Please enter some ingredients");
      return;
    }

    if (aiMode === "simplify" && !recipeId) {
      setError("Please select a recipe first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result;
      const userMessage = {
        type: "user",
        content: input || "Simplify instructions",
      };

      if (aiMode === "suggest") {
        const ingredients = input
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i);
        result = await aiService.suggestRecipe(ingredients, aiOptions);
        const aiMessage = {
          type: "ai",
          content: result.suggestions || result,
          metadata: result,
        };
        setResponses((prev) => [...prev, userMessage, aiMessage]);
      } else if (aiMode === "simplify") {
        result = await aiService.simplifyRecipe(recipeId, aiOptions);
        const aiMessage = {
          type: "ai",
          content: result.simplified,
          metadata: result,
        };
        setResponses((prev) => [...prev, userMessage, aiMessage]);
      } else if (aiMode === "generate") {
        result = await aiService.generateRecipe(input, aiOptions);
        const aiMessage = {
          type: "ai",
          content: result.recipe,
          metadata: result,
        };
        setResponses((prev) => [...prev, userMessage, aiMessage]);
      } else if (aiMode === "analyze") {
        result = await aiService.analyzeNutrition(recipeId);
        const aiMessage = {
          type: "ai",
          content: result.analysis,
          metadata: result,
        };
        setResponses((prev) => [...prev, userMessage, aiMessage]);
      }

      toast.success("AI response generated!");
      setInput("");
    } catch (err) {
      console.error("AI Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to get AI response. Please try again."
      );
      toast.error("AI service error");
    } finally {
      setLoading(false);
    }
  };

  const instructionsArrayToString = (instructions) => {
  if (!Array.isArray(instructions)) return instructions || "";

  return instructions
    .map((step, index) => `${index + 1}. ${step}`)
    .join("\n");
};


  const handleSaveRecipe = async (suggestion) => {
    try {
      const recipeData = parseAISuggestion(suggestion);
      if (!recipeData) {
        toast.error("Could not parse AI suggestion");
        return;
      }

      if(Array.isArray(recipeData.instructions)){
        recipeData.instructions = instructionsArrayToString(recipeData.instructions)
      }

      toast.loading("Saving recipe...");
      const response = await recipeApi.createRecipe(recipeData);
      toast.dismiss();
      toast.success("Recipe saved successfully!");

      if (onRecipeGenerated) {
        onRecipeGenerated(response.recipe);
      }

      setResponses((prev) => [
        ...prev,
        {
          type: "system",
          content: "✅ Recipe saved to your collection!",
        },
      ]);
    } catch {
      toast.dismiss();
      toast.error("Failed to save recipe");
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  const renderAIResponse = (response) => {
    if (!response.content) return null;

    // Handle string response
    if (typeof response.content === "string") {
      return (
        <div className="prose prose-sm max-w-none">
          {response.content.split("\n").map((line, i) => (
            <p key={i} className="mb-2">
              {line}
            </p>
          ))}
        </div>
      );
    }
    if (response.content.simplifiedInstructions) {
      const {
        simplifiedInstructions,
        steps,
        totalSimplifiedTime,
        complexityLevel,
      } = response.content;
      console.log("steps", response.content.simplified);
      return (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">
            Simplified Instructions
          </h4>
          <p className="text-gray-700">{simplifiedInstructions}</p>

          {steps?.length > 0 && (
            <div className="mt-2 space-y-3">
              <h5 className="font-semibold text-gray-800">Steps:</h5>
              {steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-3 border rounded-lg bg-gray-50"
                >
                  <p className="font-medium text-gray-700">
                    Step {step.stepNumber}:
                  </p>
                  <p className="text-gray-700">{step.description}</p>
                  <p className="text-sm text-gray-500">
                    Time: {step.timeMinutes} min
                  </p>
                  {step.tip && (
                    <p className="text-sm text-yellow-600">Tip: {step.tip}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-600 mt-2">
            Total Time: {totalSimplifiedTime} min | Complexity:{" "}
            {complexityLevel}
          </p>
        </div>
      );
    }

    // Existing array handling for recipe suggestions
    if (Array.isArray(response.content)) {
      return (
        <div className="space-y-4">
          {response.content.map((recipe, index) => (
            <div key={index} className="card p-4">
              <h4 className="font-bold text-lg text-gray-800 mb-2">
                {recipe.name}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div>Cuisine: {recipe.cuisine}</div>
                <div>Time: {recipe.prepTimeMinutes} min</div>
                <div>Difficulty: {recipe.difficulty}</div>
                <div>Servings: {recipe.servings || 2}</div>
              </div>
              <div className="mb-3">
                <h5 className="font-semibold text-gray-700 mb-1">
                  Ingredients:
                </h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {Array.isArray(recipe.ingredients) ? (
                    recipe.ingredients
                      .slice(0, 5)
                      .map((ing, i) => <li key={i}>{ing}</li>)
                  ) : (
                    <li>{recipe.ingredients}</li>
                  )}
                </ul>
              </div>
              <button
                onClick={() => handleSaveRecipe(recipe)}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center text-sm"
              >
                <FiSave className="mr-2" />
                Save This Recipe
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (typeof response.content === "object") {
      return (
        <div className="space-y-4">
          {" "}
          {Object.entries(response.content).map(([key, value]) => (
            <div key={key}>
              {" "}
              <h5 className="font-semibold text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, " $1")}:
              </h5>{" "}
              {typeof value === "string" ? (
                <p className="text-gray-600">{value}</p>
              ) : Array.isArray(value) ? (
                <ul className="list-disc list-inside text-gray-600">
                  {" "}
                  {value.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}{" "}
                </ul>
              ) : (
                <pre className="text-sm text-gray-600">
                  {JSON.stringify(value, null, 2)}
                </pre>
              )}{" "}
            </div>
          ))}{" "}
        </div>
      );
    }
    return JSON.stringify(response.content, null, 2);
  };

  return (
    <div className={`${standaloneMode ? "" : "mb-8"}`}>
      {!standaloneMode && (
        <div
          className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <FiChevronDown className="text-xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold">AI Recipe Assistant</h3>
              <p className="text-sm opacity-90">
                Powered by Groq AI • Click to {isOpen ? "collapse" : "expand"}
              </p>
            </div>
          </div>
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      )}

      {(isOpen || standaloneMode) && (
        <div className="bg-white rounded-b-xl shadow-lg border border-t-0">
          <div className="p-6">
            {/* Mode Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setAiMode("suggest")}
                className={`px-4 py-2 rounded-lg transition flex items-center ${
                  aiMode === "suggest"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FiZap className="mr-2" />
                Suggest Recipe
              </button>
              <button
                onClick={() => setAiMode("simplify")}
                disabled={!recipeId}
                className={`px-4 py-2 rounded-lg transition flex items-center ${
                  aiMode === "simplify"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${!recipeId ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <FiMessageSquare className="mr-2" />
                Simplify Instructions
              </button>
              <button
                onClick={() => setAiMode("generate")}
                className={`px-4 py-2 rounded-lg transition flex items-center ${
                  aiMode === "generate"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FiStar className="mr-2" />
                Generate Recipe
              </button>
              <button
                onClick={() => setAiMode("analyze")}
                disabled={!recipeId}
                className={`px-4 py-2 rounded-lg transition flex items-center ${
                  aiMode === "analyze"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${!recipeId ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <FiClock className="mr-2" />
                Analyze Nutrition
              </button>
            </div>

            {/* AI Options */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">AI Options:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiMode === "suggest" || aiMode === "generate" ? (
                  <>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Cuisine
                      </label>
                      <select
                        value={aiOptions.cuisine}
                        onChange={(e) =>
                          setAiOptions({
                            ...aiOptions,
                            cuisine: e.target.value,
                          })
                        }
                        className="input-primary text-sm"
                      >
                        <option value="">Any Cuisine</option>
                        {CUISINE_OPTIONS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Meal Type
                      </label>
                      <select
                        value={aiOptions.mealType}
                        onChange={(e) =>
                          setAiOptions({
                            ...aiOptions,
                            mealType: e.target.value,
                          })
                        }
                        className="input-primary text-sm"
                      >
                        <option value="">Any Meal</option>
                        {MEAL_TYPE_OPTIONS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Prep Time
                      </label>
                      <select
                        value={aiOptions.prepTime}
                        onChange={(e) =>
                          setAiOptions({
                            ...aiOptions,
                            prepTime: e.target.value,
                          })
                        }
                        className="input-primary text-sm"
                      >
                        <option value="">Any Time</option>
                        <option value="15">Quick (&lt;15 min)</option>
                        <option value="30">Fast (&lt;30 min)</option>
                        <option value="60">Moderate (&lt;60 min)</option>
                      </select>
                    </div>

                    <div className="flex items-center mt-6">
  <input
    type="checkbox"
    id="isVegetarian"
    checked={aiOptions.isVegetarian}
    onChange={(e) =>
      setAiOptions({
        ...aiOptions,
        isVegetarian: e.target.checked,
      })
    }
    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
  />
  <label
    htmlFor="isVegetarian"
    className="ml-2 text-sm text-gray-700"
  >
    Vegetarian Only 🌱
  </label>
</div>

                  </>
                ) : aiMode === "simplify" ? (
                  <>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Complexity
                      </label>
                      <select
                        value={aiOptions.complexity}
                        onChange={(e) =>
                          setAiOptions({
                            ...aiOptions,
                            complexity: e.target.value,
                          })
                        }
                        className="input-primary text-sm"
                      >
                        {AI_COMPLEXITY_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Language
                      </label>
                      <select
                        value={aiOptions.language}
                        onChange={(e) =>
                          setAiOptions({
                            ...aiOptions,
                            language: e.target.value,
                          })
                        }
                        className="input-primary text-sm"
                      >
                        {AI_LANGUAGE_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            {/* Input Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {aiMode === "suggest"
                  ? "Enter ingredients (comma-separated)"
                  : aiMode === "generate"
                  ? "Describe the recipe you want"
                  : "AI will work with the current recipe"}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  aiMode === "suggest"
                    ? "e.g., chicken, rice, vegetables, spices..."
                    : aiMode === "generate"
                    ? "e.g., a quick vegetarian pasta dish with tomatoes and basil..."
                    : "Click the button below to proceed"
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                rows="3"
                disabled={aiMode === "simplify" || aiMode === "analyze"}
              />

              {/* Sample Prompts */}
              {(aiMode === "suggest" || aiMode === "generate") && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">
                    Try these examples:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {samplePrompts[aiMode]?.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleAIAction}
              disabled={loading || (aiMode === "suggest" && !input.trim())}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition disabled:opacity-50 flex items-center justify-center mb-6"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  AI is thinking...
                </>
              ) : (
                <>
                  <FiChevronDown className="mr-2" />
                  {aiMode === "suggest"
                    ? "Get Recipe Suggestions"
                    : aiMode === "simplify"
                    ? "Simplify Instructions"
                    : aiMode === "generate"
                    ? "Generate Recipe"
                    : "Analyze Nutrition"}
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Responses */}
            {responses.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">AI Responses:</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto p-2">
                  {responses.map((response, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        response.type === "user"
                          ? "bg-blue-50 border border-blue-100 ml-8"
                          : response.type === "ai"
                          ? "bg-green-50 border border-green-100"
                          : "bg-gray-50 border border-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          {response.type === "user" ? (
                            <span className="text-sm font-medium text-blue-600">
                              You
                            </span>
                          ) : response.type === "ai" ? (
                            <span className="text-sm font-medium text-green-600 flex items-center">
                              <FiChevronDown className="mr-1" /> AI Assistant
                            </span>
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              System
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {response.type === "ai" && response.content && (
                            <>
                              {aiMode === "suggest" && (
                                <button
                                  onClick={() =>
                                    handleSaveRecipe(response.content)
                                  }
                                  className="p-1 text-green-600 hover:text-green-800"
                                  title="Save Recipe"
                                >
                                  <FiSave size={16} />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  handleCopyToClipboard(
                                    typeof response.content === "string"
                                      ? response.content
                                      : JSON.stringify(
                                          response.content,
                                          null,
                                          2
                                        )
                                  )
                                }
                                className="p-1 text-gray-600 hover:text-gray-800"
                                title="Copy to Clipboard"
                              >
                                <FiCopy size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-700">
                        {renderAIResponse(response)}
                      </div>
                    </div>
                  ))}
                </div>

                {responses.some((r) => r.type === "ai") && (
                  <div className="text-center pt-4 border-t">
                    <button
                      onClick={() => setResponses([])}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear Conversation
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* AI Tips */}
            <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <FiChevronDown className="mr-2 text-yellow-500" />
                AI Assistant Tips
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <FiChevronRight className="mr-2 text-yellow-500 mt-0.5" />
                  For recipe suggestions, list ingredients you have available
                </li>
                <li className="flex items-start">
                  <FiChevronRight className="mr-2 text-yellow-500 mt-0.5" />
                  The AI can generate complete recipes from descriptions
                </li>
                <li className="flex items-start">
                  <FiChevronRight className="mr-2 text-yellow-500 mt-0.5" />
                  Save AI-generated recipes directly to your collection
                </li>
                <li className="flex items-start">
                  <FiChevronRight className="mr-2 text-yellow-500 mt-0.5" />
                  Use filters to get more specific recipe suggestions
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatBox;
