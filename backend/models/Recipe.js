import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Recipe name is required"],
      trim: true,
      maxlength: [100, "Recipe name cannot exceed 100 characters"],
    },
    cuisine: {
      type: String,
      required: [true, "Cuisine type is required"],
      enum: [
        "Indian",
        "Italian",
        "Chinese",
        "Mexican",
        "Mediterranean",
        "Japanese",
        "Thai",
        "American",
        "French",
        "Spanish",
        "Korean",
        "Vietnamese",
        "Middle Eastern",
        "Greek",
        "Other",
      ],
    },
    isVegetarian: {
      type: Boolean,
      default: true,
    },
    prepTimeMinutes: {
      type: Number,
      required: [true, "Preparation time is required"],
      min: [1, "Preparation time must be at least 1 minute"],
      max: [1440, "Preparation time cannot exceed 1440 minutes (24 hours)"],
    },
    cookTimeMinutes: {
      type: Number,
      default: 0,
      min: [0, "Cook time cannot be negative"],
    },
    servings: {
      type: Number,
      default: 2,
      min: [1, "Servings must be at least 1"],
    },
    ingredients: [
      {
        type: String,
        required: [true, "Ingredient is required"],
        trim: true,
      },
    ],
    instructions: {
      type: String,
      required: [true, "Cooking instructions are required"],
      minlength: [10, "Instructions must be at least 10 characters long"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    imageUrl: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          return (
            v === "" || /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(v)
          );
        },
        message: "Please provide a valid image URL",
      },
    },
    calories: {
      type: Number,
      min: [0, "Calories cannot be negative"],
    },
    createdBy: {
      type: String,
      default: "System",
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

recipeSchema.virtual("totalTimeMinutes").get(function () {
  return this.prepTimeMinutes + this.cookTimeMinutes;
});

recipeSchema.index({
  name: "text",
  ingredients: "text",
  tags: "text",
  cuisine: "text",
  instructions: "text",
});

recipeSchema.index({ cuisine: 1, isVegetarian: 1, difficulty: 1 });
recipeSchema.index({ prepTimeMinutes: 1 });
recipeSchema.index({ createdAt: -1 });

recipeSchema.pre("save", async function () {
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.map((tag) => tag.toLowerCase().trim());
  }
//   next();
});

recipeSchema.statics.searchRecipes = async function (searchTerm, filters = {}) {
  const query = {};
  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }

  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined && filters[key] !== "") {
      query[key] = filters[key];
    }
  });

  return this.find(query).sort({ createdAt: -1 }).limit(100);
};

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
