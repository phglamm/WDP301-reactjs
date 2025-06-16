import { request } from "./request";

const authService = {
  login: async (loginData) => {
    try {
      const response = await request("POST", "auth/login", loginData);
      
      // The response should contain the data object with access_token and user
      if (response && response.data) {
        return response.data; // Return { access_token, user }
      }
      
      // If response structure is different, handle it
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  logout: () => {
    // Clear any stored tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },
};

export default authService;
