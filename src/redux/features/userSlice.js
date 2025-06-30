/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    access_token: null,
    isAuthenticated: false,
  },
  reducers: {
    login: (state, action) => {
      // Save the entire login response data
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
      state.isAuthenticated = true;

      // Also save to localStorage for persistence
      localStorage.setItem("access_token", action.payload.access_token);
      Cookies.set("token", action.payload.access_token, {
        expires: 7, // Set cookie to expire in 7 days
      });
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    },
    // Action to restore user from localStorage on app start
    restoreUser: (state) => {
      const token = localStorage.getItem("access_token");
      const user = localStorage.getItem("user");

      if (token && user) {
        state.access_token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    },
  },
});

export const { login, logout, restoreUser } = userSlice.actions;

// Selectors
export const selectUser = (store) => store.user.user;
export const selectAccessToken = (store) => store.user.access_token;
export const selectIsAuthenticated = (store) => store.user.isAuthenticated;
export const selectUserRole = (store) => store.user.user?.role;

export default userSlice.reducer;
