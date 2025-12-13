import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiClock, 
  FiUsers, 
  FiStar, 
  FiEye, 
  FiHeart, 
  // FiChefHat,
  FiCheckCircle
} from 'react-icons/fi';
import { formatTime, getTagColor } from '../utils/helpers';

const RecipeCard = ({ recipe, viewMode = 'grid' }) => {
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite || false);

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // In a real app, you would update this in the backend
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/recipe/${recipe._id}`} className="block">
        <div className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-48 lg:w-56 flex-shrink-0">
              <div className="h-48 md:h-full relative overflow-hidden">
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                    <FiHeart className="text-4xl text-yellow-400" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className={`badge ${difficultyColors[recipe.difficulty]}`}>
                    {recipe.difficulty}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={handleFavoriteToggle}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                  >
                    <FiHeart
                      className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.name}</h3>
                  <div className="flex items-center space-x-4 text-gray-600 mb-3">
                    <span className="flex items-center">
                      <FiClock className="mr-1" />
                      {formatTime(recipe.prepTimeMinutes)}
                    </span>
                    <span className="flex items-center">
                      <FiUsers className="mr-1" />
                      {recipe.servings || 2} servings
                    </span>
                    <span className={`badge ${recipe.isVegetarian ? 'badge-vegetarian' : 'badge-non-veg'}`}>
                      {recipe.isVegetarian ? 'Vegetarian' : 'Non-Veg'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-500 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={star <= Math.floor(recipe.rating || 0) ? 'fill-current' : ''}
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">({recipe.rating || '0'})</span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <FiEye className="mr-1" />
                    {recipe.views || 0} views
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {recipe.instructions?.substring(0, 150)}...
              </p>

              {/* Cuisine and Tags */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {recipe.cuisine}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags?.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs rounded-full ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                  {recipe.tags?.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{recipe.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View (default)
  return (
    <Link to={`/recipe/${recipe._id}`} className="block">
      <div className="card h-full hover:shadow-xl transition-all duration-300 recipe-card group">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
              <FiHeart className="text-5xl text-yellow-400 group-hover:scale-110 transition-transform duration-500" />
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Difficulty Badge */}
          <div className="absolute top-3 left-3">
            <span className={`badge ${difficultyColors[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
          </div>
          
          {/* Vegetarian Badge */}
          <div className="absolute top-3 right-3">
            <span className={`badge ${recipe.isVegetarian ? 'badge-vegetarian' : 'badge-non-veg'}`}>
              {recipe.isVegetarian ? '🥬 Veg' : '🍗 Non-Veg'}
            </span>
          </div>
          
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-12 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100"
          >
            <FiHeart
              className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}
              size={18}
            />
          </button>
          
          {/* Quick Stats Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <FiClock className="mr-1" />
                {formatTime(recipe.prepTimeMinutes)}
              </span>
              <span className="flex items-center">
                <FiUsers className="mr-1" />
                {recipe.servings || 2} servings
              </span>
              <span className="flex items-center">
                <FiEye className="mr-1" />
                {recipe.views || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Rating */}
          <div className="flex items-center justify-between mb-2">
          
            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
          </div>

          {/* Recipe Name */}
          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors line-clamp-1">
            {recipe.name}
          </h3>

          {/* Cuisine */}
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              {recipe.cuisine}
            </span>
          </div>

          {/* Ingredients Preview */}
          <div className="mb-4 flex-1">
            <p className="text-sm text-gray-600 line-clamp-2">
              <span className="font-medium">Ingredients: </span>
              {recipe.ingredients?.slice(0, 3).map(ing => ing.split(' ')[0]).join(', ')}
              {recipe.ingredients?.length > 3 && '...'}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {recipe.tags?.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-1 rounded-full ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
            {recipe.tags?.length > 2 && (
              <span className="text-xs text-gray-500">
                +{recipe.tags.length - 2} more
              </span>
            )}
          </div>

          {/* View Recipe Button */}
          <div className="mt-auto pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Click to view recipe
              </span>
              <FiCheckCircle className="text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;