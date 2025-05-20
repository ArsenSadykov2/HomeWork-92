import {createSlice} from "@reduxjs/toolkit";
import {login} from "./usersThunks.ts";
import type {GlobalError, User} from "../../types";
import type {RootState} from "../../app/store.ts";

interface UsersState {
    user: User | null;
    loginLoading: boolean;
    loginError: GlobalError | null;
}

const initialState: UsersState = {
    user: null,
    loginLoading: false,
    loginError: null,
}

export const selectUser = (state: RootState) => state.users.user;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        unsetUser: (state) => {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loginLoading = true;
                state.loginError = null;
            })
            .addCase(login.fulfilled, (state, {payload: user}) => {
                state.user = user;
                state.loginLoading = false;
            })
            .addCase(login.rejected, (state, {payload: error}) => {
                state.loginLoading = false;
                state.loginError = error || null;
            })

    }
});

export const usersReducer = usersSlice.reducer;
export const {unsetUser} = usersSlice.actions;