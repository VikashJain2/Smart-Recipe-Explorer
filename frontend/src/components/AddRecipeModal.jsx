import React, { useState, useEffect, useRef } from "react";
import {
  FiX,
  FiSave,
  FiPlus,
  FiTrash2,
  FiUpload,
  FiChevronDown,
  FiChevronUp,
  FiImage,
} from "react-icons/fi";
import { recipeApi } from "../services/api";
import { CUISINE_OPTIONS, DIFFICULTY_OPTIONS } from "../utils/constants";
import { validateRecipe } from "../utils/helpers";
import { toast } from "react-hot-toast";
import uploadImage from "../utils/uploadImage";

const AddRecipeModal = ({
  isOpen,
  onClose,
  onSuccess,
  editingRecipe = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    isVegetarian: true,
    prepTimeMinutes: 30,
    cookTimeMinutes: 0,
    servings: 2,
    ingredients: [""],
    instructions: "",
    difficulty: "medium",
    tags: [""],
    calories: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    ingredients: true,
    instructions: true,
    advanced: false,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingRecipe) {
      setTagsInput(editingRecipe.tags?.join(",") || "");
      setFormData({
        name: editingRecipe.name || "",
        cuisine: editingRecipe.cuisine || "",
        isVegetarian: editingRecipe.isVegetarian ?? true,
        prepTimeMinutes: editingRecipe.prepTimeMinutes || 30,
        cookTimeMinutes: editingRecipe.cookTimeMinutes || 0,
        servings: editingRecipe.servings || 2,
        ingredients:
          editingRecipe.ingredients?.length > 0
            ? editingRecipe.ingredients
            : [""],
        instructions: editingRecipe.instructions || "",
        difficulty: editingRecipe.difficulty || "medium",
        tags: editingRecipe.tags?.length > 0 ? editingRecipe.tags : [""],
        calories: editingRecipe.calories || "",
        imageUrl: editingRecipe.imageUrl || "",
      });
      if (editingRecipe.imageUrl) {
        setImagePreview(editingRecipe.imageUrl);
      }
    }
  }, [editingRecipe]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleIngredientsChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData({ ...formData, ingredients: newIngredients });
    }
  };
  const handleTagsInputChange = (e) => {
  setTagsInput(e.target.value);
};


  const validateForm = () => {
    const validationErrors = validateRecipe(formData);
    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    uploadToCloudinary(file);
  };

  const uploadToCloudinary = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    console.log("file", file);

    try {
      // Upload to Cloudinary
      const response = await uploadImage(file);

      // const data = await response.json();

      // Update form data with the secure URL
      setFormData((prev) => ({
        ...prev,
        imageUrl: response,
      }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      setImagePreview("");
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean data
      const cleanedData = {
        ...formData,
        prepTimeMinutes: parseInt(formData.prepTimeMinutes),
        cookTimeMinutes: parseInt(formData.cookTimeMinutes || 0),
        servings: parseInt(formData.servings),
        calories: formData.calories ? parseInt(formData.calories) : undefined,
        ingredients: formData.ingredients.filter((ing) => ing.trim() !== ""),
        tags: tagsInput.split(",").map(tag => tag.trim()).filter(Boolean)
      };

      let response;
      if (editingRecipe) {
        response = await recipeApi.updateRecipe(editingRecipe._id, cleanedData);
        toast.success("Recipe updated successfully!");
      } else {
        response = await recipeApi.createRecipe(cleanedData);
        toast.success("Recipe created successfully!");
      }

      if (response.success) {
        onSuccess?.(response.recipe);
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save recipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      cuisine: "",
      isVegetarian: true,
      prepTimeMinutes: 30,
      cookTimeMinutes: 0,
      servings: 2,
      ingredients: [""],
      instructions: "",
      difficulty: "medium",
      tags: [""],
      calories: "",
      imageUrl: "",
    });
    setImagePreview("");
    setErrors([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="modal-content w-full max-w-4xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="flex justify-between items-center p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {editingRecipe ? "Edit Recipe" : "Add New Recipe"}
              </h2>
              <p className="text-gray-600 mt-1">
                {editingRecipe
                  ? "Update your recipe details"
                  : "Share your culinary creation with the world"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-medium text-red-800 mb-2">
              Please fix the following errors:
            </h3>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => toggleSection("basic")}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                Basic Information
              </h3>
              {expandedSections.basic ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {expandedSections.basic && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipe Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-primary"
                    placeholder="e.g., Paneer Butter Masala"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cuisine *
                  </label>
                  <select
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    required
                    className="input-primary"
                  >
                    <option value="">Select Cuisine</option>
                    {CUISINE_OPTIONS.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preparation Time (minutes) *
                  </label>
                  <input
                    type="number"
                    name="prepTimeMinutes"
                    value={formData.prepTimeMinutes}
                    onChange={handleChange}
                    required
                    min="1"
                    max="1440"
                    className="input-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cooking Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="cookTimeMinutes"
                    value={formData.cookTimeMinutes}
                    onChange={handleChange}
                    min="0"
                    max="1440"
                    className="input-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Servings *
                  </label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleChange}
                    required
                    min="1"
                    className="input-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    required
                    className="input-primary"
                  >
                    {DIFFICULTY_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isVegetarian"
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleChange}
                      className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isVegetarian"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Vegetarian
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories (per serving, optional)
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    min="0"
                    className="input-primary"
                    placeholder="e.g., 350"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Ingredients Section */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => toggleSection("ingredients")}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                Ingredients *
              </h3>
              {expandedSections.ingredients ? (
                <FiChevronUp />
              ) : (
                <FiChevronDown />
              )}
            </button>

            {expandedSections.ingredients && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  List all ingredients with quantities. Each ingredient will be
                  on a new line.
                </p>

                <div className="space-y-3">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-gray-500 w-6">{index + 1}.</span>
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) =>
                          handleIngredientsChange(index, e.target.value)
                        }
                        placeholder={`Ingredient ${
                          index + 1
                        } (e.g., 2 cups flour)`}
                        className="input-primary flex-1"
                        required={index === 0}
                      />
                      {formData.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addIngredient}
                  className="flex items-center text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                >
                  <FiPlus className="mr-2" />
                  Add Another Ingredient
                </button>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💡 <strong>Tip:</strong> Include measurements for better
                    results. Example: "2 tomatoes, chopped" or "1 tbsp olive
                    oil"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Instructions Section */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => toggleSection("instructions")}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                Instructions *
              </h3>
              {expandedSections.instructions ? (
                <FiChevronUp />
              ) : (
                <FiChevronDown />
              )}
            </button>

            {expandedSections.instructions && (
              <div className="space-y-4">
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="input-primary"
                  placeholder="Write step-by-step instructions. You can use numbers or bullet points. Example:
1. Heat oil in a pan.
2. Add onions and sauté until golden.
3. Add spices and cook for 2 minutes.
..."
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Minimum 10 characters required</span>
                  <span>{formData.instructions.length} characters</span>
                </div>
              </div>
            )}
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => toggleSection("advanced")}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                Image & Advanced Options
              </h3>
              {expandedSections.advanced ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {expandedSections.advanced && (
              <div className="space-y-6">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-700">
                    Recipe Image
                  </h4>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                  />

                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Recipe preview"
                              className="w-40 h-40 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">
                              Image uploaded successfully! You can remove it or
                              upload a new one.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={triggerFileInput}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition"
                      >
                        <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-700 font-medium">
                          Click to upload recipe image
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Supports JPG, PNG, WebP, GIF • Max 5MB
                        </p>
                      </div>
                    )}

                    {isUploading && (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                          Uploading...
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    <p>Or use an existing image URL:</p>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="input-primary flex-1"
                        placeholder="https://example.com/recipe-image.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.imageUrl) {
                            setImagePreview(formData.imageUrl);
                          }
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Use URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tags Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={handleTagsInputChange}
                    className="input-primary"
                    placeholder="e.g., dinner, healthy, quick, indian"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tags help users find your recipe. Separate with commas.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Quick Preview:</h4>
            <div className="flex items-start gap-4">
              <div className="flex-1 text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Name:</strong> {formData.name || "Not set"}
                </p>
                <p>
                  <strong>Cuisine:</strong> {formData.cuisine || "Not set"}
                </p>
                <p>
                  <strong>Time:</strong> {formData.prepTimeMinutes} min prep,{" "}
                  {formData.cookTimeMinutes || 0} min cook
                </p>
                <p>
                  <strong>Ingredients:</strong>{" "}
                  {formData.ingredients.filter((i) => i.trim()).length} items
                </p>
                <p>
                  <strong>Image:</strong>{" "}
                  {formData.imageUrl ? "Uploaded" : "Not uploaded"}
                </p>
              </div>
              {imagePreview && (
                <div className="w-20 h-20">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  // Reset to sample data
                  setFormData({
                    name: "Sample Recipe",
                    cuisine: "Indian",
                    isVegetarian: true,
                    prepTimeMinutes: 30,
                    cookTimeMinutes: 15,
                    servings: 4,
                    ingredients: [
                      "2 tomatoes, chopped",
                      "1 onion, sliced",
                      "2 tbsp oil",
                      "Salt to taste",
                    ],
                    instructions:
                      "1. Heat oil in a pan.\n2. Add onions and sauté until golden.\n3. Add tomatoes and cook for 5 minutes.\n4. Season with salt and serve hot.",
                    difficulty: "easy",
                    tags: ["sample", "quick", "vegetarian"],
                    calories: 200,
                    imageUrl: "",
                  });
                }}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Load Sample
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    {editingRecipe ? "Update Recipe" : "Save Recipe"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeModal;
