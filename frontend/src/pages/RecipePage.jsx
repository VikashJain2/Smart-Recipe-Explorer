import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiClock, 
  FiUsers, 
  FiFlag, 
  FiStar, 
  FiEye,
  FiHeart,
  FiEdit,
  FiTrash2,
  FiShare2,
  FiPrinter,
  FiArrowLeft,
  FiBookmark,
  FiCheckCircle
} from 'react-icons/fi';
import AIChatBox from '../components/AIChatBox';
import LoadingSpinner from '../components/LoadingSpinner';
import AddRecipeModal from '../components/AddRecipeModal';
import { recipeApi } from '../services/api';
import { formatTime, getTagColor } from '../utils/helpers';
import { toast } from 'react-hot-toast';

const RecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await recipeApi.getRecipe(id);
      
      if (response.success) {
        setRecipe(response.recipe);
        setIsFavorite(response.recipe.isFavorite || false);
      } else {
        setError('Recipe not found');
      }
    } catch (err) {
      setError('Failed to load recipe');
      console.error('Error fetching recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      // In a real app, you would update this in the backend
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch  {
      toast.error('Failed to update favorite status');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: `Check out this recipe: ${recipe.name}`,
          url: window.location.href,
        });
        toast.success('Recipe shared successfully');
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading recipe..." />;
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🍳</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recipe Not Found</h2>
        <p className="text-gray-600 mb-8">The recipe you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/"
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          <FiArrowLeft className="inline mr-2" />
          Back to Recipes
        </Link>
      </div>
    );
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  const totalTime = recipe.prepTimeMinutes + (recipe.cookTimeMinutes || 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-yellow-600 transition"
        >
          <FiArrowLeft className="mr-2" />
          Back to Recipes
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recipe Details */}
        <div className="lg:col-span-2">
          {/* Recipe Header */}
          <div className="card p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`badge ${difficultyColors[recipe.difficulty]}`}>
                    {recipe.difficulty}
                  </span>
                  <span className={`badge ${recipe.isVegetarian ? 'badge-vegetarian' : 'badge-non-veg'}`}>
                    {recipe.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {recipe.cuisine}
                  </span>
                  
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleFavoriteToggle}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <FiHeart className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'} />
                </button>
         
                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Share recipe"
                >
                  <FiShare2 className="text-gray-600" />
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Print recipe"
                >
                  <FiPrinter className="text-gray-600" />
                </button>
        
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FiClock className="text-2xl text-yellow-500 mx-auto mb-2" />
                <div className="font-bold text-gray-900">{formatTime(totalTime)}</div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FiUsers className="text-2xl text-yellow-500 mx-auto mb-2" />
                <div className="font-bold text-gray-900">{recipe.servings || 2}</div>
                <div className="text-sm text-gray-600">Servings</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FiFlag className="text-2xl text-yellow-500 mx-auto mb-2" />
                <div className="font-bold text-gray-900 capitalize">{recipe.difficulty}</div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FiEye className="text-2xl text-yellow-500 mx-auto mb-2" />
                <div className="font-bold text-gray-900">{recipe.views || 0}</div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
            </div>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ingredients Section */}
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiBookmark className="mr-2 text-yellow-500" />
              Ingredients
              <span className="ml-2 text-sm font-normal text-gray-600">
                ({recipe.ingredients.length} items)
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-3">
                {recipe.ingredients.slice(0, Math.ceil(recipe.ingredients.length / 2)).map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {recipe.ingredients.slice(Math.ceil(recipe.ingredients.length / 2)).map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {recipe.calories && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-700">
                  <strong>Estimated Nutrition:</strong> {recipe.calories} calories per serving
                </p>
              </div>
            )}
          </div>

          {/* Instructions Section */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Instructions</h2>
            
            <div className="prose prose-lg max-w-none">
              {recipe.instructions.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                
                // Check if paragraph starts with a number (step)
                if (/^\d+\./.test(paragraph.trim())) {
                  return (
                    <div key={index} className="mb-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                          {paragraph.split('.')[0]}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700">{paragraph.substring(paragraph.indexOf('.') + 1).trim()}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <p key={index} className="mb-4 text-gray-700">
                    {paragraph}
                  </p>
                );
              })}
            </div>
            
            {/* AI Assistant Button */}
            <div className="mt-8 pt-6 border-t">
              <button
                onClick={() => setShowAIChat(!showAIChat)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition flex items-center justify-center"
              >
                {showAIChat ? 'Hide' : 'Show'} AI Assistant
                <FiFlag className="ml-2" />
              </button>
            </div>
          </div>

          {/* AI Chat Box */}
          {showAIChat && (
            <div className="mt-8">
              <AIChatBox 
                recipeId={id}
                recipeInstructions={recipe.instructions}
                onRecipeGenerated={fetchRecipe}
              />
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Cook's Notes */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <FiFlag className="mr-2 text-yellow-500" />
              Cook's Notes
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                Read through the entire recipe before starting
              </li>
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                Prep all ingredients before cooking (mise en place)
              </li>
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                Adjust seasoning to taste at the end
              </li>
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                Let the dish rest before serving for better flavor
              </li>
            </ul>
          </div>

          {/* Time Breakdown */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-4">Time Breakdown</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Preparation</span>
                  <span className="font-medium">{formatTime(recipe.prepTimeMinutes)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500"
                    style={{ width: `${(recipe.prepTimeMinutes / totalTime) * 100}%` }}
                  ></div>
                </div>
              </div>
              {recipe.cookTimeMinutes > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Cooking</span>
                    <span className="font-medium">{formatTime(recipe.cookTimeMinutes)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500"
                      style={{ width: `${(recipe.cookTimeMinutes / totalTime) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <div className="pt-2 border-t">
                <div className="flex justify-between font-medium">
                  <span>Total Time</span>
                  <span>{formatTime(totalTime)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Stats */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-4">Recipe Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Added On</span>
                <span className="font-medium">
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">
                  {new Date(recipe.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ingredients Count</span>
                <span className="font-medium">{recipe.ingredients.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Steps</span>
                <span className="font-medium">
                  {recipe.instructions.split('\n').filter(p => p.trim()).length}
                </span>
              </div>
            </div>
          </div>

          {/* Related Actions */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/?cuisine=${recipe.cuisine}`)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="font-medium text-gray-800">Find more {recipe.cuisine} recipes</div>
                <div className="text-sm text-gray-600">Browse similar cuisine</div>
              </button>
              <button
                onClick={() => navigate(`/?difficulty=${recipe.difficulty}`)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="font-medium text-gray-800">More {recipe.difficulty} recipes</div>
                <div className="text-sm text-gray-600">Browse similar difficulty</div>
              </button>
              <button
                onClick={() => navigate('/?showAI=true')}
                className="w-full text-left p-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg transition"
              >
                <div className="font-medium text-purple-700">Get AI Recipe Suggestions</div>
                <div className="text-sm text-purple-600">Based on ingredients</div>
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* Print Styles */}
      <style>
        {`
          @media print {
            nav, footer, button, .no-print {
              display: none !important;
            }
            .card {
              border: 1px solid #ddd;
              box-shadow: none;
            }
            body {
              font-size: 12pt;
            }
          }
        `}
      </style>
    </div>
  );
};

export default RecipePage;