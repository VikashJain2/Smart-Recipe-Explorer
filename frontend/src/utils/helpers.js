export const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${mins} min`;
};

export const formatIngredients = (ingredients) => {
  if (!Array.isArray(ingredients)) return "";
  return ingredients.map((ing) => `• ${ing}`).join("\n");
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const capitalize = (str) => {
  if (!str) return "";
  return str.chatAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getTagColor = (tag) => {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
  ];
  const index = tag.charCodeAt(0) % colors.length;
  return colors[index];
};

export const getRatingStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push("★");
  }

  if (hasHalfStar) {
    stars.push("☆");
  }

  while (stars.length < 5) {
    stars.push("");
  }

  return stars;
};

export const debounce = (fun, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      fun(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const validateRecipe = (recipe) => {
  const errors = [];

  if (!recipe.name || recipe.name.trim().length < 2) {
    errors.push("Recipe name must be at least 2 characters");
  }

  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    errors.push("At least one ingredient is required");
  }

  if (!recipe.instructions || recipe.instructions.trim().length < 10) {
    errors.push("Instructions must be at least 10 characters");
  }

  if (!recipe.prepTimeMinutes || recipe.prepTimeMinutes < 1) {
    errors.push("Preparation time must be at least 1 minute");
  }

  return errors;
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};

  for (const [key, value] of params) {
    result[key] = value;
  }

  return result;
};
