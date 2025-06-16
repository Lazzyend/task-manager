import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

interface User {
  username: string;
  password: string;
  id?: string;
}

interface AuthState {
  users: User[];
  currentUser: User | null;
}

const initialState: AuthState = {
  users: [],
  currentUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUsers: (state, { payload }: PayloadAction<AuthState>) => {
      return payload;
    },
    registerUser: (state, action: PayloadAction<User>) => {
      const userExists = state.users.some(
        (u) => u.username === action.payload.username
      );

      if (userExists) console.error("User exist");

      if (!userExists)
        state.users = [
          ...state.users,
          { ...action.payload, id: uuidv4() },
        ];
    },
    loginUser: (state, action: PayloadAction<User>) => {
      const found = state.users.find(
        (u) =>
          u.username === action.payload.username &&
          u.password === action.payload.password
      );

      if (found) {
        state.currentUser = found;
      }
    },
    loadCurrentUser: (state) => {
      const saved = localStorage.getItem("authCurrentUser");
      if (saved) {
        state.currentUser = JSON.parse(saved);
      }
    },
    logoutUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const {
  registerUser,
  loginUser,
  loadCurrentUser,
  logoutUser,
  setUsers,
} = authSlice.actions;
export default authSlice.reducer;
