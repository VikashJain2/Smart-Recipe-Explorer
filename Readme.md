# Smart Recipe Explorer

A small MERN + AI demo app for creating, browsing and enhancing recipes with AI.  
Backend (Express + MongoDB + Groq AI + Cloudinary). Frontend (React + Vite).

---

## Repo layout (high level)

- backend/ — Express API, models, AI controllers, Cloudinary upload
  - [backend/index.js](backend/index.js)
  - [backend/controllers/recipeController.js](backend/controllers/recipeController.js) — exports: [`getRecipes`](backend/controllers/recipeController.js), [`getRecipeById`](backend/controllers/recipeController.js), [`createRecipe`](backend/controllers/recipeController.js), [`checkEmpty`](backend/controllers/recipeController.js)
  - [backend/controllers/aiController.js](backend/controllers/aiController.js) — exports: [`suggestRecipe`](backend/controllers/aiController.js), [`simplifyRecipe`](backend/controllers/aiController.js), [`generateRecipe`](backend/controllers/aiController.js), [`analyzeNutrition`](backend/controllers/aiController.js)
  - [backend/controllers/uploadImageController.js](backend/controllers/uploadImageController.js)
  - [backend/models/Recipe.js](backend/models/Recipe.js) — Mongoose schema `Recipe`
  - [backend/routes/recipeRoutes.js](backend/routes/recipeRoutes.js)
  - [backend/routes/aiRoutes.js](backend/routes/aiRoutes.js)
  - [backend/routes/updateImageRoute.js](backend/routes/updateImageRoute.js)
  - [backend/utils/uploadImage.js](backend/utils/uploadImage.js)
  - [backend/seedData.js](backend/seedData.js)

- frontend/ — React app (Vite)
  - [frontend/src/App.jsx](frontend/src/App.jsx)
  - [frontend/src/pages/HomePage.jsx](frontend/src/pages/HomePage.jsx)
  - [frontend/src/pages/RecipePage.jsx](frontend/src/pages/RecipePage.jsx)
  - [frontend/src/components/AddRecipeModal.jsx](frontend/src/components/AddRecipeModal.jsx)
  - [frontend/src/components/AIChatBox.jsx](frontend/src/components/AIChatBox.jsx)
  - [frontend/src/services/api.js](frontend/src/services/api.js) — `recipeApi`, `uploadApi`
  - [frontend/src/services/aiService.js](frontend/src/services/aiService.js) — `aiService`, [`parseAISuggestion`](frontend/src/services/aiService.js)
  - [frontend/src/utils/uploadImage.js](frontend/src/utils/uploadImage.js)

---

## Quick start

1. Backend
   - Copy env: `cp backend/.env.example backend/.env` and set real values (MongoDB, GROQ key, Cloudinary).
   - Install & run:
     ```sh
     cd backend
     npm install
     node --watch --env-file=.env index.js
     ```
   - Default backend port: `3000` (see ).

2. Frontend
   - Configure API URL in  (default ).
   - Install & run:
     ```sh
     cd frontend
     npm install
     npm run dev
     ```

3. Seed DB (local)
   - Run the seed script:
     ```sh
     backend/
      node --env-file=.env seedData.js
     ```
   - See samples in .

---

## Environment variables

- Backend: see 
  - PORT, MONGODB_URI, GROQ_API_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET_KEY
- Frontend:
  -  → VITE_API_URL

---

## API Endpoints (examples)

Base URL:  (default `http://localhost:3000/api/`)

Recipes
- GET /api/recipes
  - Controller:   
  - Query params: search, cuisine, isVegetarian, minTime, maxTime, difficulty, tags, ingredients, sortBy, order, page, limit  
  - Example:
    ```sh
    curl "http://localhost:3000/api/recipes?search=pasta&cuisine=Italian&page=1&limit=12"
    ```

- GET /api/recipes/get-by-id/:id
  - Controller:   
  - Example:
    ```sh
    curl "http://localhost:3000/api/recipes/get-by-id/64f1a2b3c4d5e6f7a8b9c0d"
    ```

- POST /api/recipes
  - Controller:   
  - Body (JSON):
    ```json
    {
      "name":"Tomato Pasta",
      "cuisine":"Italian",
      "isVegetarian":true,
      "prepTimeMinutes":20,
      "cookTimeMinutes":15,
      "servings":2,
      "ingredients":["Pasta","Tomato","Garlic"],
      "instructions":"1. Boil pasta...\n2. Make sauce...",
      "difficulty":"easy",
      "tags":["pasta","quick"],
      "calories":450,
      "imageUrl":"https://..."
    }
    ```
  - Example:
    ```sh
    curl -X POST http://localhost:3000/api/recipes \
      -H "Content-Type: application/json" \
      -d '{"name":"Tomato Pasta","cuisine":"Italian","ingredients":["Pasta"],"instructions":"Cook pasta.","prepTimeMinutes":10}'
    ```

- GET /api/recipes/check-empty
  - Controller:   
  - Example:
    ```sh
    curl http://localhost:3000/api/recipes/check-empty
    ```

AI Endpoints
- POST /api/ai/suggest
  - Controller:   
  - Body (JSON):
    ```json
    {
      "ingredients":["tomato","basil","pasta"],
      "cuisine":"Italian",
      "difficulty":"easy",
      "prepTime":30,
      "mealType":"dinner",
      "isVegetarian":true
    }
    ```
  - Example:
    ```sh
    curl -X POST http://localhost:3000/api/ai/suggest \
      -H "Content-Type: application/json" \
      -d '{"ingredients":["tomato","basil","pasta"]}'
    ```

- POST /api/ai/simplify/:recipeId
  - Controller:   
  - Body (JSON):   
  - Example:
    ```sh
    curl -X POST http://localhost:3000/api/ai/simplify/RECIPE_ID \
      -H "Content-Type: application/json" \
      -d '{"complexity":"beginner"}'
    ```

- POST /api/ai/generate
  - Controller:   
  - Body (JSON):   
  - Example:
    ```sh
    curl -X POST http://localhost:3000/api/ai/generate \
      -H "Content-Type: application/json" \
      -d '{"description":"A quick vegetarian stir-fry with broccoli and carrot"}'
    ```

- GET /api/ai/analyze/:recipeId
  - Controller:   
  - Example:
    ```sh
    curl http://localhost:3000/api/ai/analyze/RECIPE_ID
    ```

File upload (images)
- POST /api/file/upload
  - Route:  →  →   
  - Multipart form field:   
  - Example (curl):
    ```sh
    curl -X POST http://localhost:3000/api/file/upload \
      -F "image=@/path/to/photo.jpg"
    ```
  - Frontend helper:  calls  in .

---

## Frontend usage (important files)

- AI UI and calls:  (uses )
- Add / edit recipe modal & local validations:  (uses  in  and  )
- API wrapper:  — provides  and .
- Recipe pages: , 

---

## Notes & troubleshooting

- AI endpoints rely on Groq SDK config in  — set  in backend env.
- Cloudinary upload requires cloud credentials in backend env; upload pipeline uses memory multer () and Cloudinary stream in .
- Mongoose schema & validations are in . Validation errors return 400 with messages from that file.
- If frontend shows CORS errors, verify  /  and backend CORS options in .

---

## Useful commands

- Start backend: (from backend/)
  ```sh
  node --watch --env-file=.env index.js
  ```
- Seed Data: (from backend/)
  ```sh
  node --evn-file=.env seedData.js 