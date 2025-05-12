import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get('http://localhost:5000/api/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

// Assign role to a user
export const assignRole = createAsyncThunk(
  'users/assignRole',
  async ({ id, role }, { dispatch }) => {
    const token = localStorage.getItem('token');
    await axios.put(
      `http://localhost:5000/api/users/${id}/role`,
      { role },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch(fetchUsers()); // Refresh user list after assigning role
  }
);

// Assign an employee to a manager's team
export const assignToTeam = createAsyncThunk(
  'users/assignToTeam',
  async ({ managerId, employeeId }, { dispatch }) => {
    const token = localStorage.getItem('token');
    await axios.put(
      `http://localhost:5000/api/users/${managerId}/team`,
      { employeeId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch(fetchUsers()); // Refresh user list after assigning to the team
  }
);

// Fetch manager's team
export const fetchManagerTeam = createAsyncThunk('users/fetchManagerTeam', async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get('http://localhost:5000/api/users/team', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // Returns the manager's team
});

// User slice to manage users and teams
const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    team: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchManagerTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchManagerTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.team = action.payload;
      })
      .addCase(fetchManagerTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(assignRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignRole.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(assignToTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignToTeam.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignToTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
