import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  
  FiSearch, 
 
  FiCoffee, 
  FiMenu, 
  FiX,
  FiZap,
  FiBook
} from 'react-icons/fi';
import { recipeApi } from '../services/api';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDatabaseEmpty, setIsDatabaseEmpty] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
 

  const handleSeedDatabase = async () => {
    try {
      toast.loading('Loading sample recipes...');
      const response = await recipeApi.seedDatabase();
      toast.dismiss();
      toast.success(response.message);
      setIsDatabaseEmpty(false);
      navigate('/');
      window.location.reload();
    } catch  {
      toast.dismiss();
      toast.error('Failed to load sample recipes');
    }
  };

  const handleQuickAdd = async () => {
    const quickRecipes = [
      { name: "Scrambled Eggs", cuisine: "American", ingredients: "eggs, butter, salt" },
      { name: "Tomato Pasta", cuisine: "Italian", ingredients: "pasta, tomatoes, garlic" },
      { name: "Vegetable Salad", cuisine: "Other", ingredients: "lettuce, tomatoes, cucumber" }
    ];

    try {
      toast.loading('Adding quick recipes...');
      for (const recipe of quickRecipes) {
        await recipeApi.quickAdd(recipe);
      }
      toast.dismiss();
      toast.success('Quick recipes added!');
      setIsDatabaseEmpty(false);
      navigate('/');
      window.location.reload();
    } catch  {
      toast.dismiss();
      toast.error('Failed to add quick recipes');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <FiCoffee className="text-3xl text-yellow-500" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Smart Recipe</h1>
                <p className="text-xs text-gray-500 -mt-1">AI Explorer</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search recipes..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </form>

              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition ${isActive('/') ? 'bg-yellow-50 text-yellow-600' : 'text-gray-700 hover:text-yellow-600'}`}
              >
                <FiHome className="inline mr-2" />
                Home
              </Link>

              <button
                onClick={() => navigate('/?showAI=true')}
                className="px-4 py-2 text-gray-700 hover:text-yellow-600 transition flex items-center"
              >
                <FiZap className="mr-2" />
                AI Assistant
              </button>

              {isDatabaseEmpty && (
                <div className="relative">
                  <button
                    onClick={() => setShowQuickStart(!showQuickStart)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition flex items-center"
                  >
                    <FiZap className="mr-2" />
                    Quick Start
                  </button>

                  {showQuickStart && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50">
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-800 mb-2 text-sm">Get Started Fast</h3>
                        <div className="space-y-2">
                          <button
                            onClick={handleQuickAdd}
                            className="w-full text-left p-2 bg-green-50 hover:bg-green-100 rounded transition text-sm"
                          >
                            <div className="font-medium text-green-700">Add Quick Recipes</div>
                            <div className="text-xs text-green-600">3 simple recipes</div>
                          </button>
                          
                          <button
                            onClick={handleSeedDatabase}
                            className="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded transition text-sm"
                          >
                            <div className="font-medium text-blue-700">Load Sample Recipes</div>
                            <div className="text-xs text-blue-600">8 detailed recipes</div>
                          </button>
                          
                          <Link
                            to="/?showAddModal=true"
                            className="block p-2 bg-yellow-50 hover:bg-yellow-100 rounded transition text-sm"
                          >
                            <div className="font-medium text-yellow-700">Add Custom Recipe</div>
                            <div className="text-xs text-yellow-600">Create your own</div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </form>

              <div className="space-y-2">
                <Link
                  to="/"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiHome className="inline mr-2" />
                  Home
                </Link>

                <button
                  onClick={() => {
                    navigate('/?showAI=true');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FiZap className="inline mr-2" />
                  AI Assistant
                </button>

                {isDatabaseEmpty && (
                  <div className="space-y-2 pt-2 border-t">
                    <button
                      onClick={handleQuickAdd}
                      className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-lg"
                    >
                      Add Quick Recipes
                    </button>
                    <button
                      onClick={handleSeedDatabase}
                      className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg"
                    >
                      Load Sample Recipes
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Database Empty Banner */}
      {isDatabaseEmpty && location.pathname === '/' && (
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-2 md:mb-0">
                <FiBook className="mr-2" />
                <span className="font-medium">No recipes found! Get started quickly:</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleQuickAdd}
                  className="px-3 py-1 bg-white text-yellow-600 rounded-lg text-sm font-medium hover:bg-gray-100"
                >
                  Add Quick Recipes
                </button>
                <button
                  onClick={handleSeedDatabase}
                  className="px-3 py-1 bg-white text-yellow-600 rounded-lg text-sm font-medium hover:bg-gray-100"
                >
                  Load Samples
                </button>
                <button
                  onClick={() => navigate('/?showAddModal=true')}
                  className="px-3 py-1 bg-white text-yellow-600 rounded-lg text-sm font-medium hover:bg-gray-100"
                >
                  Add Custom Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;