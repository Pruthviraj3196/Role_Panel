import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'https://role-panel-1.onrender.com/api/orders';

export const fetchOrders = createAsyncThunk('orders/fetch', async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const placeOrder = createAsyncThunk('orders/place', async (order) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(API, order, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`${API}/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (_, action) => action.payload)
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.findIndex((order) => order._id === action.payload._id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      });
  },
});

export default orderSlice.reducer;
