import axios from "axios";
import toast from "react-hot-toast";

// Use environment variable or default to localhost
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Configure Interceptors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;

      // Tier 3: Concurrency Conflict Handler
      if (status === 409) {
        toast.error("Action already in progress. Please wait.");
      }
      
      // Tier 1 & Tier 2: Global Rate Limit / Daily Quota Handler
      else if (status === 429 || (status === 403 && data?.upgradeRequired)) {
        // As per architecture rule 1: Do not use react hooks outside tree.
        // Dispatch native browser event to be caught by UpgradeContext.
        const detail = {
          message: data?.error || data?.message || "You've reached your usage limits. Please check your plan.",
          modelCost: data?.modelCost,
          resetAt: data?.resetAt,
        };
        
        window.dispatchEvent(
          new CustomEvent("rate-limit-hit", { detail })
        );
      }
      
      // Tier 4: Global Graceful Error Fallback
      else if (status >= 400 && status !== 401 && status !== 403) {
         // Exclude 401 and 403 (standard auth issues usually handled by redirects)
         const errorMessage = data?.error || data?.message || "We encountered an unexpected issue. Please try again.";
         toast.error(errorMessage);
      }
    } else if (error.request) {
      // Network Error / Timeout (No response from server)
      toast.error("Unable to reach the server. Please check your internet connection.");
    } else {
      // Something else happened while setting up the request
      toast.error("An unexpected error occurred.");
    }
    
    // Always reject so the calling function's catch block also runs
    return Promise.reject(error);
  }
);

export default api;
