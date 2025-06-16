import { render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import projectReducer from "../../store/projectSlice/projectSlice";
import { ProjectType } from "../Project/types";
import TaskCard from "./TaskCard";

const mockProject: ProjectType = {
  id: "p1",
  title: "Project Title",
  dueDate: "2025-06-20",
  tasks: [],
};

const renderWithStore = () => {
  const store = configureStore({
    reducer: {
      projects: projectReducer,
    },
    preloadedState: {
      projects: {
        items: [mockProject],
        selectedProject: "p1",
      },
    },
  });

  return render(
    <Provider store={store}>
      <TaskCard item={mockProject} />
    </Provider>
  );
};

describe("Task - Unit", () => {
  test("renders project title", () => {
    renderWithStore();
    expect(screen.getByText("Project Title")).toBeInTheDocument();
  });

  test("renders due date", () => {
    renderWithStore();
    const expectedDate = new Date("2025-06-20").toLocaleDateString();
    const fullText = `Due: ${expectedDate}`;
    expect(screen.getByText(fullText)).toBeInTheDocument();
  });

  test("shows 'New Task' button", () => {
    renderWithStore();
    expect(
      screen.getByRole("button", { name: /new task/i })
    ).toBeInTheDocument();
  });
});
