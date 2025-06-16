import { configureStore, combineReducers } from "@reduxjs/toolkit";
import projectReducer from "./projectSlice/projectSlice";
import authReducer from "./authSlice/authSlice";

const saveToLocalStorage = (state: RootState) => {
  const stateToSave = {
    projects: state.projects,
    auth: state.auth,
  };

  localStorage.setItem("appState", JSON.stringify(stateToSave));
};

const rootReducer = combineReducers({
  projects: projectReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

store.subscribe(() => {
  const state = store.getState();

  if (state.projects.items && state.projects.items.length > 0) {
    saveToLocalStorage(state);
  } else {
    const existing = localStorage.getItem("appState");
    let projects = [];
    if (existing) {
      try {
        projects = JSON.parse(existing).projects || [];
      } catch { }
    }
    localStorage.setItem(
      "appState",
      JSON.stringify({
        projects,
        auth: state.auth,
      })
    );
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
