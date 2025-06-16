import { render, screen, fireEvent } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import projectReducer from "../../store/projectSlice/projectSlice";
import { ProjectType } from "../../components/Project/types";
import { Priority, Status } from "../../types";
import TaskCard from "../../components/TaskCard/TaskCard";

const mockProject: ProjectType = {
  id: "p1",
  title: "Test Project",
  dueDate: "2025-06-20",
  tasks: [
    {
      id: "t1",
      title: "Task 1",
      description: "Desc 1",
      priority: Priority.high,
      status: Status.pending,
      dueDate: "2025-06-25",
    },
  ],
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

describe("TaskCard - Integration", () => {
  test("renders task list", () => {
    renderWithStore();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
  });

  test("can open task in edit mode", () => {
    renderWithStore();
    fireEvent.click(screen.getByText(/edit/i));
    expect(screen.getByDisplayValue("Task 1")).toBeInTheDocument();
  });

  test("can cancel edit mode", () => {
    renderWithStore();
    fireEvent.click(screen.getByText(/edit/i));
    fireEvent.click(screen.getByText(/cancel/i));
    expect(screen.queryByPlaceholderText("Title")).not.toBeInTheDocument();
  });
});
