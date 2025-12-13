import mongoose from "mongoose";
import Recipe from "./models/Recipe.js";

const sampleRecipes =[
  {
    name: "Paneer Tikka Masala",
    cuisine: "Indian",
    isVegetarian: true,
    prepTimeMinutes: 30,
    cookTimeMinutes: 25,
    servings: 4,
    ingredients: [
      "300g paneer cubes",
      "1 onion chopped",
      "2 tomatoes pureed",
      "1 tbsp ginger-garlic paste",
      "1/2 cup yogurt",
      "1 tsp turmeric",
      "1 tsp red chili powder",
      "1 tbsp garam masala",
      "Fresh coriander"
    ],
    instructions: "Marinate paneer and grill. Prepare masala with onion, tomato, spices, and mix grilled paneer.",
    difficulty: "medium",
    tags: ["indian", "paneer", "curry"],
    imageUrl: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
    calories: 380,
    createdBy: "System",
    isFavorite: false,
    rating: 4.5,
    views: 820
  },
  {
    name: "Margherita Pizza",
    cuisine: "Italian",
    isVegetarian: true,
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    servings: 2,
    ingredients: [
      "Pizza dough",
      "Tomato sauce",
      "Fresh mozzarella",
      "Fresh basil",
      "Olive oil"
    ],
    instructions: "Spread sauce on dough, add cheese, bake, and finish with basil.",
    difficulty: "easy",
    tags: ["pizza", "italian", "fast-food"],
    imageUrl: "https://images.pexels.com/photos/1580466/pexels-photo-1580466.jpeg",
    calories: 300,
    rating: 4.7,
    views: 1400
  },
  {
    name: "Veg Hakka Noodles",
    cuisine: "Chinese",
    isVegetarian: true,
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    servings: 2,
    ingredients: [
      "Noodles",
      "Capsicum",
      "Cabbage",
      "Carrot",
      "Soy sauce",
      "Vinegar",
      "Pepper"
    ],
    instructions: "Boil noodles, stir fry vegetables, add sauces, and toss everything.",
    difficulty: "easy",
    tags: ["noodles", "asian", "street-food"],
    imageUrl: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg",
    calories: 420,
    rating: 4.3,
    views: 760
  },
  {
    name: "Veggie Burrito",
    cuisine: "Mexican",
    isVegetarian: true,
    prepTimeMinutes: 20,
    cookTimeMinutes: 10,
    servings: 2,
    ingredients: [
      "Tortilla",
      "Beans",
      "Rice",
      "Lettuce",
      "Cheese",
      "Salsa"
    ],
    instructions: "Layer beans, rice, veggies in tortilla and roll tightly.",
    difficulty: "easy",
    tags: ["mexican", "fast-food"],
    imageUrl: "https://images.pexels.com/photos/7551193/pexels-photo-7551193.jpeg",
    calories: 350,
    rating: 4.4,
    views: 500
  },
  {
    name: "Falafel Wrap",
    cuisine: "Middle Eastern",
    isVegetarian: true,
    prepTimeMinutes: 25,
    cookTimeMinutes: 10,
    servings: 2,
    ingredients: [
      "Falafel",
      "Pita bread",
      "Tahini sauce",
      "Lettuce",
      "Tomatoes",
      "Cucumber"
    ],
    instructions: "Fill pita with falafel, veggies, and tahini sauce.",
    difficulty: "medium",
    tags: ["wrap", "middle eastern"],
    imageUrl: "https://images.pexels.com/photos/533902/pexels-photo-533902.jpeg",
    calories: 430,
    rating: 4.6,
    views: 950
  },
  {
    name: "Vegetable Fried Rice",
    cuisine: "Chinese",
    isVegetarian: true,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 2,
    ingredients: [
      "Cooked rice",
      "Carrot",
      "Peas",
      "Soy sauce",
      "Spring onion",
      "Oil"
    ],
    instructions: "Stir fry veggies, add rice and sauces.",
    difficulty: "easy",
    tags: ["rice", "fried rice", "asian"],
    imageUrl: "https://images.pexels.com/photos/5202080/pexels-photo-5202080.jpeg",
    calories: 290,
    rating: 4.2,
    views: 620
  },
  {
    name: "Greek Salad",
    cuisine: "Greek",
    isVegetarian: true,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    servings: 2,
    ingredients: [
      "Cucumber",
      "Tomatoes",
      "Feta cheese",
      "Olives",
      "Olive oil"
    ],
    instructions: "Combine veggies and drizzle with olive oil.",
    difficulty: "easy",
    tags: ["salad", "healthy", "greek"],
    imageUrl: "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg",
    calories: 180,
    rating: 4.1,
    views: 400
  },
  {
    name: "Veg Sushi Roll",
    cuisine: "Japanese",
    isVegetarian: true,
    prepTimeMinutes: 35,
    cookTimeMinutes: 10,
    servings: 3,
    ingredients: [
      "Sushi rice",
      "Seaweed",
      "Cucumber",
      "Avocado",
      "Rice vinegar"
    ],
    instructions: "Spread rice on seaweed, roll with vegetables, and slice.",
    difficulty: "hard",
    tags: ["sushi", "japanese"],
    imageUrl: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg",
    calories: 250,
    rating: 4.3,
    views: 820
  },
  {
    name: "Vegetable Lasagna",
    cuisine: "Italian",
    isVegetarian: true,
    prepTimeMinutes: 45,
    cookTimeMinutes: 30,
    servings: 4,
    ingredients: [
      "Lasagna sheets",
      "Marinara sauce",
      "Mozzarella cheese",
      "Spinach",
      "Bell peppers"
    ],
    instructions: "Layer pasta, sauce, vegetables, and cheese. Bake until golden.",
    difficulty: "hard",
    tags: ["italian", "cheesy", "baked"],
    imageUrl: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg",
    calories: 520,
    rating: 4.8,
    views: 1680
  },
  {
    name: "Veg Quesadilla",
    cuisine: "Mexican",
    isVegetarian: true,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 2,
    ingredients: [
      "Tortilla",
      "Bell peppers",
      "Cheese",
      "Onions",
      "Oil"
    ],
    instructions: "Fill tortillas with cheese and veggies and grill until crispy.",
    difficulty: "easy",
    tags: ["mexican", "cheese", "snack"],
    imageUrl: "https://images.pexels.com/photos/3184195/pexels-photo-3184195.jpeg",
    calories: 320,
    rating: 4.4,
    views: 780
  }
]
;

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await Recipe.deleteMany({});
    console.log('🗑️  Cleared existing recipes');
    
    // Insert sample recipes
    await Recipe.insertMany(sampleRecipes);
    console.log(`✅ Inserted ${sampleRecipes.length} sample recipes`);
    
    // Get stats
    const totalRecipes = await Recipe.countDocuments();
    const vegetarianCount = await Recipe.countDocuments({ isVegetarian: true });
    
    console.log('\n📊 Database Statistics:');
    console.log(`   Total Recipes: ${totalRecipes}`);
    console.log(`   Vegetarian: ${vegetarianCount}`);
    console.log(`   Non-Vegetarian: ${totalRecipes - vegetarianCount}`);
    
    mongoose.connection.close();
    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();