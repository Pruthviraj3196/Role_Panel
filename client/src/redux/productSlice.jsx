import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://role-panel-1.onrender.com/api/products';

// Fetch all products
export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

// Create a new product
export const createProduct = createAsyncThunk('products/create', async (productData) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(API_URL, productData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
});

// Update an existing product
export const updateProduct = createAsyncThunk('products/update', async ({ id, updates }) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${API_URL}/${id}`, updates, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => action.payload)
      .addCase(createProduct.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      });
  },
});

export default productSlice.reducer;
