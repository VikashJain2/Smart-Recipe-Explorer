export const CUISINE_OPTIONS = [
  'Indian', 'Italian', 'Chinese', 'Mexican', 'Mediterranean',
  'Japanese', 'Thai', 'American', 'French', 'Spanish',
  'Korean', 'Vietnamese', 'Middle Eastern', 'Greek', 'Other'
];

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-800' }
];

export const MEAL_TYPE_OPTIONS = [
  'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert',
  'Appetizer', 'Main Course', 'Side Dish', 'Beverage'
];

export const DIETARY_TAGS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
  'Nut-Free', 'Low-Carb', 'High-Protein', 'Keto', 'Paleo'
];

export const PREP_TIME_RANGES = [
  { label: 'Quick (< 15 min)', value: 15 },
  { label: 'Fast (15-30 min)', value: 30 },
  { label: 'Moderate (30-60 min)', value: 60 },
  { label: 'Long (> 60 min)', value: 120 }
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'prepTime', label: 'Prep Time (Low to High)' },
  { value: 'difficulty', label: 'Difficulty' }
];

export const AI_COMPLEXITY_OPTIONS = [
  { value: 'beginner', label: 'Beginner - Simple steps' },
  { value: 'intermediate', label: 'Intermediate - Some cooking experience' },
  { value: 'expert', label: 'Expert - Detailed instructions' }
];

export const AI_LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' }
];