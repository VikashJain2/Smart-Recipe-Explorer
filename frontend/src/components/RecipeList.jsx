import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import SearchFilter from './SearchFilter';
import LoadingSpinner from './LoadingSpinner';
import { FiFilter, FiGrid, FiList, FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import { recipeApi } from '../services/api';

const RecipeList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });

  // Get filters from URL
  const getCurrentFilters = () => {
    const filters = {};
    searchParams.forEach((value, key) => {
      if (key !== 'page') {
        filters[key] = value;
      }
    });
    return filters;
  };

  useEffect(() => {
    fetchRecipes();
  }, [searchParams]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(searchParams);
      const response = await recipeApi.getRecipes(params);
      
      if (response.success) {
        setRecipes(response.recipes || []);
        setPagination({
          page: response.currentPage || 1,
          limit: 12,
          total: response.total || 0,
          totalPages: response.totalPages || 1
        });
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    const newParams = new URLSearchParams();
    
    // Add all filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        newParams.set(key, value);
      }
    });
    
    // Reset to page 1 when filters change
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams({ page: '1' }));
  };

  if (loading) {
    return <LoadingSpinner message="Loading recipes..." />;
  }

  const currentFilters = getCurrentFilters();
  const hasActiveFilters = Object.keys(currentFilters).length > 1; // Excluding page

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {hasActiveFilters ? 'Filtered Recipes' : 'All Recipes'}
          </h1>
          <p className="text-gray-600 mt-1">
            Showing {recipes.length} of {pagination.total} recipes
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
             <button
              onClick={() => fetchRecipes()}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
            >
              <FiRefreshCw className={viewMode === 'list' ? 'text-yellow-600' : 'text-gray-500'} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
            >
              <FiGrid className={viewMode === 'grid' ? 'text-yellow-600' : 'text-gray-500'} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
            >
              <FiList className={viewMode === 'list' ? 'text-yellow-600' : 'text-gray-500'} />
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center ${
              showFilters ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiFilter className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && (
              <span className="ml-2 bg-white text-yellow-600 text-xs px-2 py-1 rounded-full">
                {Object.keys(currentFilters).length - 1}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-red-600 hover:text-red-700"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-8">
          <SearchFilter
            initialFilters={currentFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {Object.entries(currentFilters).map(([key, value]) => {
              if (key === 'page') return null;
              return (
                <div
                  key={key}
                  className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                >
                  <span className="font-medium">{key}:</span>
                  <span className="ml-1">{value}</span>
                  <button
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete(key);
                      setSearchParams(newParams);
                    }}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recipe Grid/List */}
      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4 text-6xl">🍳</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes found</h3>
          <p className="text-gray-500 mb-6">
            {hasActiveFilters 
              ? 'Try adjusting your search filters or clear them to see all recipes.'
              : 'Start by adding your first recipe or loading sample recipes.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-6'
          }>
            {recipes.map((recipe) => (
              <RecipeCard 
                key={recipe._id} 
                recipe={recipe} 
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <FiChevronLeft className="text-xl" />
              </button>

              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg ${
                      pagination.page === pageNum
                        ? 'bg-yellow-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <FiChevronRight className="text-xl" />
              </button>

              <span className="ml-4 text-gray-600 text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
            </div>
          )}
        </>
      )}

      {/* Quick Stats */}
      {recipes.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{recipes.length}</div>
              <div className="text-sm text-gray-600">Recipes Shown</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {recipes.filter(r => r.isVegetarian).length}
              </div>
              <div className="text-sm text-gray-600">Vegetarian</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {recipes.filter(r => r.difficulty === 'easy').length}
              </div>
              <div className="text-sm text-gray-600">Easy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(recipes.reduce((sum, r) => sum + r.prepTimeMinutes, 0) / recipes.length)}
              </div>
              <div className="text-sm text-gray-600">Avg Time (min)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeList;