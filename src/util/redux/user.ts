import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMe, loginApi } from "../../api/user/user";
import { setToken } from "../token";

export type User = {
  user: null | { username: string; id: string };
  isLoading: boolean;
};

const initialState: User = {
  user: null,
  isLoading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const loginRedux = createAsyncThunk(
  "user/login",
  async (data: { username: string; password: string }) => {
    const response = await loginApi({
      username: data.username,
      password: data.password,
    });
    setToken(response.data.token);
    return response.data;
  }
);

export const fetchMeRedux = createAsyncThunk("user/fetchMe", async () => {
  const response = await getMe();

  return response.data.data;
});

export const { setUser, setLoading } = userSlice.actions;
