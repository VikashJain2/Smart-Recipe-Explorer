import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeList from "../components/RecipeList";
import AddRecipeModal from "../components/AddRecipeModal";
import AIChatBox from "../components/AIChatBox";
import EmptyState from "../components/EmptyState";
import { recipeApi } from "../services/api";
import { FiFilter } from "react-icons/fi";

const HomePage = ({ showAIPanel = false, showAddModal = false }) => {
  const [searchParams] = useSearchParams();

  const [showAddRecipeModal, setShowAddRecipeModal] = useState(showAddModal);
  const [showAIChatBox, setShowAIChatBox] = useState(showAIPanel);
  const [isDatabaseEmpty, setIsDatabaseEmpty] = useState(false);

  const checkDatabaseEmpty = async () => {
    try {
      const response = await recipeApi.checkEmpty();
      if (response.success) {
        setIsDatabaseEmpty(response.isEmpty);
      }
    } catch (error) {
      console.error("Failed to check database:", error);
    }
  };

  useEffect(() => {
    const showAI = searchParams.get("showAI") === "true";

    setShowAIChatBox(showAI);

    checkDatabaseEmpty();
  }, [searchParams]);

  const handleAddRecipeSuccess = () => {
    setIsDatabaseEmpty(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Smart Recipe Explorer
          <span className="block text-2xl md:text-3xl text-yellow-600 mt-2">
            AI-Powered Cooking Companion
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Discover, create, and simplify recipes with artificial intelligence.
          Whether you're a beginner or a master chef, find your next culinary
          adventure.
        </p>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setShowAddRecipeModal(true)}
            className="btn-primary px-6 py-3"
          >
            + Add New Recipe
          </button>
          <button
            onClick={() => setShowAIChatBox(!showAIChatBox)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition"
          >
            {showAIChatBox ? "Hide" : "Show"} AI Assistant
          </button>
        </div>
      </div>
      {/* AI Chat Box */}
      {showAIChatBox && (
        <div className="mb-8">
          <AIChatBox
            onRecipeGenerated={handleAddRecipeSuccess}
            standaloneMode={true}
          />
        </div>
      )}

      {/* Empty State or Recipe List */}
      {isDatabaseEmpty ? (
        <EmptyState
          onAddRecipe={() => setShowAddRecipeModal(true)}
          onAIAssist={() => setShowAIChatBox(true)}
          setShowAIChatBox={setShowAIChatBox}
          setShowAddRecipeModal={setShowAddRecipeModal}
        />
      ) : (
        <RecipeList />
      )}

      {/* Add Recipe Modal */}
      {showAddRecipeModal && (
        <AddRecipeModal
          isOpen={showAddRecipeModal}
          onClose={() => setShowAddRecipeModal(false)}
          onSuccess={handleAddRecipeSuccess}
        />
      )}

      {/* Quick Tips */}
      <div className="mt-12 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FiFilter className="mr-2" />
          Quick Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">
              Use AI Assistant
            </h4>
            <p className="text-sm text-gray-600">
              Let AI suggest recipes based on ingredients you have or simplify
              complex instructions.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">
              Advanced Filters
            </h4>
            <p className="text-sm text-gray-600">
              Filter recipes by cuisine, prep time, difficulty, and dietary
              preferences.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Save Favorites</h4>
            <p className="text-sm text-gray-600">
              Mark recipes as favorites for quick access to your most-loved
              dishes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
