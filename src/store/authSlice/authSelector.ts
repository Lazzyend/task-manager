import { RootState } from "..";

export const currentUser = (state: RootState) => state.auth.currentUser;
export const usersSelector = (state: RootState) => state.auth.users;
