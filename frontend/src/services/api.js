import axios from "axios";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    if (response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime;
      if (duration > 1000) {
        console.log(`Request took ${duration}ms`);
      }
    }

    if (
      response.config.method === "post" ||
      response.config.method === "put" ||
      response.config.method === "delete"
    ) {
      if (response.data?.message && !response.config.skipToast) {
        toast.success(response.data.message);
      }
    }

    return response;
  },
  (error) => {
    console.error("API Error:", error.response || error);

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          toast.error(data.message || "Bad request");
          break;
        case 401:
          toast.error("Please login to continue");
          break;
        case 403:
          toast.error("Access denied");
          break;
        case 404:
          toast.error("Resource not found");
          break;
        case 429:
          toast.error("Too many requests. Please slow down.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(data.message || "An error occurred");
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An unexpected error occurred");
    }

    return Promise.reject(error);
  }
);
export const uploadApi = {
  uploadImage: async (formData) => {
    const response = await api.post("/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
export const recipeApi = {
  getRecipes: async (params = {}) => {
    const response = await api.get("/recipes", { params });
    return response.data;
  },

  getRecipe: async (id) => {
    const response = await api.get(`/recipes/get-by-id/${id}`);
    return response.data;
  },
  createRecipe: async (recipeData) => {
    const response = await api.post("/recipes", recipeData);
    return response.data;
  },
  checkEmpty: async () => {
    const response = await api.get("/recipes/check-empty");
    return response.data;
  },
};
