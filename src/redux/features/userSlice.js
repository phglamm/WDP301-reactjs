// redux/features/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ phone, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        phone,
        password,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Lỗi không xác định'
      );
    }
  }
);



const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    logout: (state) => null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => action.payload)
      .addCase(loginUser.rejected, (state, action) => {
        console.error('Login failed:', action.payload);
        return null;
      });
  },
});

export const { logout } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;
