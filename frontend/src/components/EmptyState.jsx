import React, { useState } from 'react';
import { 
  FiCoffee, 
  FiPlusCircle, 
  FiZap, 
  FiUpload, 
  // FiChefHat,
  FiBook,
  FiStar,
  FiUsers
} from 'react-icons/fi';
import AIChatBox from './AIChatBox';
import AddRecipeModal from './AddRecipeModal';

const EmptyState = ({ onAddRecipe }) => {
  const [showAIModal, setShowAIModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);



  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl mb-8">
            <FiCoffee className="text-7xl text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Smart Recipe Explorer! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your recipe collection is empty. Let's start your culinary journey with delicious recipes!
          </p>
        </div>

        {/* Quick Start Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {/* AI Assistant Card */}
          <div 
            onClick={() => setShowAIModal(true)}
            className="card p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiZap className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              AI Recipe Assistant
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Let AI suggest recipes based on ingredients you have or create new ones from scratch.
            </p>
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium">
                Get Started
              </span>
            </div>
          </div>

          {/* Add Recipe Card */}
          <div 
            onClick={() => setShowAddModal(true)}
            className="card p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiPlusCircle className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              Add Recipe Manually
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Create your own recipe with detailed ingredients and step-by-step instructions.
            </p>
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium">
                Create Recipe
              </span>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            How Smart Recipe Explorer Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <FiBook className="text-3xl text-blue-500" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">1. Add Recipes</h3>
              <p className="text-gray-600">
                Add your favorite recipes manually or use AI to generate new ones from ingredients.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <FiStar className="text-3xl text-green-500" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">2. Explore & Filter</h3>
              <p className="text-gray-600">
                Search, filter, and sort recipes by cuisine, time, difficulty, and dietary preferences.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <FiUsers className="text-3xl text-purple-500" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">3. Cook & Enjoy</h3>
              <p className="text-gray-600">
                Follow simplified instructions, get AI tips, and create delicious meals with confidence.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Cooking?</h2>
          <p className="mb-6 opacity-90">
            Choose your preferred method to add your first recipe and begin your culinary adventure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowAIModal(true)}
              className="px-6 py-3 bg-white text-yellow-600 rounded-lg hover:bg-gray-100 font-medium flex items-center"
            >
              <FiZap className="mr-2" />
              Try AI Assistant
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-white text-yellow-600 rounded-lg hover:bg-gray-100 font-medium flex items-center"
            >
              <FiPlusCircle className="mr-2" />
              Add Manual Recipe
            </button>
          
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
          <h3 className="font-bold text-gray-800 mb-4 text-center">Quick Tips for Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                <span className="text-yellow-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Start Simple</h4>
                <p className="text-sm text-gray-600">Begin with easy recipes that have few ingredients.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                <span className="text-yellow-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Use AI Assistance</h4>
                <p className="text-sm text-gray-600">Let AI suggest recipes based on what you have in your kitchen.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                <span className="text-yellow-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Add Tags</h4>
                <p className="text-sm text-gray-600">Tag your recipes for easy searching later (e.g., "quick", "healthy", "dinner").</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                <span className="text-yellow-600 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Explore Samples</h4>
                <p className="text-sm text-gray-600">Load sample recipes to see how recipes are structured.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Modal */}
        {showAIModal && (
          <div className="mt-8">
            <AIChatBox 
              standaloneMode={true}
              onRecipeGenerated={() => {
                setShowAIModal(false);
                onAddRecipe?.();
              }}
            />
          </div>
        )}

        {/* Add Recipe Modal */}
        {showAddModal && (
          <AddRecipeModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              onAddRecipe?.();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;