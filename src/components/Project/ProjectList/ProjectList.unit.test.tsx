import { render, screen, fireEvent } from "@testing-library/react";
import ProjectList from "./ProjectList";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../../../store/projectSlice/projectSlice";

const defaultInitialState = {
  projects: {
    items: [],
    selectedProject: "",
  },
};

const renderWithStore = (initialState = defaultInitialState) => {
  const store = configureStore({
    reducer: {
      projects: projectReducer,
    },
    preloadedState: initialState,
  });

  return render(
    <Provider store={store}>
      <ProjectList />
    </Provider>
  );
};

describe("ProjectList Unit", () => {
  test("renders header", () => {
    renderWithStore();
    expect(screen.getByText(/Projects/i)).toBeInTheDocument();
  });

  test("adds a new project", () => {
    renderWithStore();
    fireEvent.click(screen.getByText(/New Project/i));
    expect(screen.getByPlaceholderText("Project Name")).toBeInTheDocument();
  });

  test("can cancel adding a new project", () => {
    renderWithStore();
    fireEvent.click(screen.getByText(/New Project/i));
    const cancelBtn = screen.getByText(/Cancel/i);
    fireEvent.click(cancelBtn);
    expect(
      screen.queryByPlaceholderText("Project Name")
    ).not.toBeInTheDocument();
  });
});
