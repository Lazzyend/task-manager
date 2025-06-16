import { render, screen, fireEvent } from "@testing-library/react";
import ProjectList from "../../components/Project/ProjectList/ProjectList";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../../store/projectSlice/projectSlice";

const initialState = {
  projects: {
    items: [
      {
        id: "1",
        title: "Test Project",
        dueDate: "2025-06-14",
        tasks: [],
      },
    ],
    selectedProject: "1",
  },
};

const renderWithStore = () => {
  const store = configureStore({
    reducer: { projects: projectReducer },
    preloadedState: initialState,
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <ProjectList />
      </Provider>
    ),
  };
};

describe("ProjectList Integration", () => {
  test("displays project from store", () => {
    renderWithStore();
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText(/14.*2025/)).toBeInTheDocument();
  });

  test("highlight selected project", () => {
    renderWithStore();
    // eslint-disable-next-line testing-library/no-node-access
    const projectItem = screen.getByTestId("project-1");
    expect(projectItem).toHaveStyle("background-color: rgb(204, 238, 255)");
  });

  test("edit button enables edit mode", () => {
    renderWithStore();
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByPlaceholderText("Project Name")).toBeInTheDocument();
  });

  test("cancel button exits edit mode", () => {
    renderWithStore();
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(
      screen.queryByPlaceholderText("Project Name")
    ).not.toBeInTheDocument();
  });

  test("new project is added and editable", () => {
    renderWithStore();
    fireEvent.click(screen.getByText("New Project"));
    expect(screen.getByPlaceholderText("Project Name")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });
});
