import React, { useState } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiClock, 
  FiFlag, 
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiTag
} from 'react-icons/fi';
import { 
  CUISINE_OPTIONS, 
  DIFFICULTY_OPTIONS, 
  PREP_TIME_RANGES,
  SORT_OPTIONS,
  DIETARY_TAGS
} from '../utils/constants';

const SearchFilter = ({ initialFilters = {}, onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    cuisine: '',
    isVegetarian: '',
    minTime: '',
    maxTime: '',
    difficulty: '',
    tags: '',
    sortBy: 'newest',
    order: 'desc',
    ...initialFilters
  });

  const [expandedSections, setExpandedSections] = useState({
    cuisine: false,
    time: false,
    dietary: false,
    advanced: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Debounce the filter change
    // clearTimeout(window.filterTimeout);
    // window.filterTimeout = setTimeout(() => {
    //   onFilterChange(newFilters);
    // }, 300);
  };

  const handleTagToggle = (tag) => {
    const currentTags = filters.tags ? filters.tags.split(',') : [];
    let newTags;
    
    if (currentTags.includes(tag)) {
      newTags = currentTags.filter(t => t !== tag);
    } else {
      newTags = [...currentTags, tag];
    }
    
    handleChange('tags', newTags.join(','));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      cuisine: '',
      isVegetarian: '',
      minTime: '',
      maxTime: '',
      difficulty: '',
      tags: '',
      sortBy: 'newest',
      order: 'desc'
    };
    
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    const { search, cuisine, isVegetarian, minTime, maxTime, difficulty, tags } = filters;
    return search || cuisine || isVegetarian || minTime || maxTime || difficulty || tags;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FiFilter className="text-2xl text-yellow-500 mr-3" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Advanced Filters</h2>
            <p className="text-sm text-gray-600">Refine your recipe search</p>
          </div>
        </div>
        
        {hasActiveFilters() && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-red-600 hover:text-red-700 flex items-center text-sm"
          >
            <FiX className="mr-2" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search Bar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Recipes
          </label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              placeholder="Search by name, ingredients, or instructions..."
              className="input-primary pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cuisine Filter */}
          <div>
            <button
              onClick={() => toggleSection('cuisine')}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FiFlag className="mr-2" />
                Cuisine Type
              </label>
              {expandedSections.cuisine ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.cuisine ? (
              <div className="grid grid-cols-2 gap-2">
                {CUISINE_OPTIONS.map(cuisine => (
                  <button
                    key={cuisine}
                    onClick={() => handleChange('cuisine', filters.cuisine === cuisine ? '' : cuisine)}
                    className={`px-3 py-2 rounded-lg text-sm text-center transition ${
                      filters.cuisine === cuisine
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            ) : (
              <select
                value={filters.cuisine}
                onChange={(e) => handleChange('cuisine', e.target.value)}
                className="input-primary"
              >
                <option value="">All Cuisines</option>
                {CUISINE_OPTIONS.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            )}
          </div>

          {/* Time Filter */}
          <div>
            <button
              onClick={() => toggleSection('time')}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FiClock className="mr-2" />
                Preparation Time
              </label>
              {expandedSections.time ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.time ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Minimum (minutes)</label>
                  <input
                    type="number"
                    value={filters.minTime}
                    onChange={(e) => handleChange('minTime', e.target.value)}
                    placeholder="0"
                    className="input-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Maximum (minutes)</label>
                  <input
                    type="number"
                    value={filters.maxTime}
                    onChange={(e) => handleChange('maxTime', e.target.value)}
                    placeholder="240"
                    className="input-primary"
                    min="0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PREP_TIME_RANGES.map(range => (
                    <button
                      key={range.value}
                      onClick={() => {
                        handleChange('maxTime', range.value);
                        handleChange('minTime', '');
                      }}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <select
                value={filters.maxTime}
                onChange={(e) => handleChange('maxTime', e.target.value)}
                className="input-primary"
              >
                <option value="">Any Time</option>
                <option value="15">Quick (&lt; 15 min)</option>
                <option value="30">Fast (&lt; 30 min)</option>
                <option value="60">Moderate (&lt; 60 min)</option>
                <option value="120">Lengthy (&lt; 2 hrs)</option>
              </select>
            )}
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => handleChange('difficulty', filters.difficulty === value ? '' : value)}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    filters.difficulty === value
                      ? color.replace('100', '500').replace('text-', 'bg-') + ' text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dietary Filters */}
        <div className="border-t pt-6">
          <button
            onClick={() => toggleSection('dietary')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <FiTag className="mr-2" />
              Dietary & Tags
            </label>
            {expandedSections.dietary ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          
          {expandedSections.dietary && (
            <div className="space-y-4">
              {/* Vegetarian Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Preference
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleChange('isVegetarian', filters.isVegetarian === 'true' ? '' : 'true')}
                    className={`px-4 py-2 rounded-lg transition ${
                      filters.isVegetarian === 'true'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Vegetarian Only
                  </button>
                  <button
                    onClick={() => handleChange('isVegetarian', filters.isVegetarian === 'false' ? '' : 'false')}
                    className={`px-4 py-2 rounded-lg transition ${
                      filters.isVegetarian === 'false'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Non-Vegetarian
                  </button>
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_TAGS.map(tag => {
                    const isActive = filters.tags?.split(',').includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 rounded-full text-sm transition ${
                          isActive
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                
                {filters.tags && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Selected tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {filters.tags.split(',').filter(tag => tag).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center"
                        >
                          {tag}
                          <button
                            onClick={() => handleTagToggle(tag)}
                            className="ml-1 text-yellow-600 hover:text-yellow-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div className="border-t pt-6">
          <button
            onClick={() => toggleSection('advanced')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <div>
              <label className="text-sm font-medium text-gray-700">Advanced Options</label>
              <p className="text-xs text-gray-500">Sorting and additional filters</p>
            </div>
            {expandedSections.advanced ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          
          {expandedSections.advanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="space-y-2">
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <div key={value} className="flex items-center">
                      <input
                        type="radio"
                        id={`sort-${value}`}
                        name="sortBy"
                        value={value}
                        checked={filters.sortBy === value}
                        onChange={(e) => handleChange('sortBy', e.target.value)}
                        className="mr-2 text-yellow-500 focus:ring-yellow-500"
                      />
                      <label htmlFor={`sort-${value}`} className="text-sm text-gray-700">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Direction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Direction
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleChange('order', 'desc')}
                    className={`px-4 py-2 rounded-lg transition ${
                      filters.order === 'desc'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Descending
                  </button>
                  <button
                    onClick={() => handleChange('order', 'asc')}
                    className={`px-4 py-2 rounded-lg transition ${
                      filters.order === 'asc'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Ascending
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters() && (
          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                  Search: "{filters.search}"
                  <button
                    onClick={() => handleChange('search', '')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.cuisine && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center">
                  Cuisine: {filters.cuisine}
                  <button
                    onClick={() => handleChange('cuisine', '')}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.isVegetarian && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                  {filters.isVegetarian === 'true' ? 'Vegetarian' : 'Non-Vegetarian'}
                  <button
                    onClick={() => handleChange('isVegetarian', '')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.maxTime && (
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center">
                  Max Time: {filters.maxTime} min
                  <button
                    onClick={() => handleChange('maxTime', '')}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.tags && filters.tags.split(',').filter(tag => tag).map(tag => (
                <span key={tag} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center">
                  {tag}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            onClick={handleClearFilters}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Reset All
          </button>
          <button
            onClick={() => onFilterChange(filters)}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center"
          >
            <FiSearch className="mr-2" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;