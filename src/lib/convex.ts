import { ConvexClient } from "convex/browser";
import { anyApi } from "convex/server";

let cachedClient: ConvexClient | null = null;

export function createConvexClient(): ConvexClient | null {
  if (typeof window === "undefined") return null;
  
  const url = import.meta.env.VITE_CONVEX_URL;
  if (!url || url.includes("your-convex-url") || url.includes("undefined")) {
    return null; // Not configured, use demo mode
  }
  
  if (!cachedClient) {
    cachedClient = new ConvexClient(url);
  }
  return cachedClient;
}

export const api = anyApi;

// Demo data for when Convex is not configured
export const DEMO_HABITS = [
  { _id: "1", name: "Prayer", category: "Faith", trackingType: "boolean", color: "#E8B4B8", icon: "🙏" },
  { _id: "2", name: "Bible Reading", category: "Faith", trackingType: "boolean", color: "#A8D5BA", icon: "📖" },
  { _id: "3", name: "Daily Bath", category: "Health", trackingType: "boolean", color: "#F4E3AC", icon: "🛁" },
  { _id: "4", name: "Calls", category: "Relationships", trackingType: "boolean", color: "#7A8B8F", icon: "📞" },
  { _id: "5", name: "Exercise", category: "Fitness", trackingType: "duration", color: "#E8B4B8", icon: "💪" },
  { _id: "6", name: "Reading", category: "Learning", trackingType: "duration", color: "#A8D5BA", icon: "📚" },
];

export const DEMO_ENTRIES: Record<string, Record<string, any>> = {};
