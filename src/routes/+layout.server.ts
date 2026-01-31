import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  // Simple load function - authentication can be added later
  return {
    isAuthenticated: true,
    user: null,
  };
};
