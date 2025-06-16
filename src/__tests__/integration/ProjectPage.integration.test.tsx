import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProjectPage from "../../components/Project/ProjectPage/ProjectPage";
import projectsReducer from "../../store/projectSlice/projectSlice";
import { ProjectType } from "../../components/Project/types";

const testProject: ProjectType = {
  id: "abc123",
  title: "Integration Test Project",
  dueDate: "2025-06-30",
  tasks: [],
};

const renderWithRealStore = (
  items = [testProject],
  selectedProject = "abc123"
) => {
  const store = configureStore({
    reducer: {
      projects: projectsReducer,
    },
    preloadedState: {
      projects: {
        items,
        selectedProject,
      },
    },
  });

  return render(
    <Provider store={store}>
      <ProjectPage />
    </Provider>
  );
};

describe("ProjectPage Integration", () => {
  it("renders the selected project card from real store", () => {
    renderWithRealStore();
    expect(screen.getByText("Integration Test Project")).toBeInTheDocument();
  });

  it("does not render if selected project ID does not match", () => {
    renderWithRealStore([testProject], "wrong-id");
    expect(
      screen.queryByText("Integration Test Project")
    ).not.toBeInTheDocument();
  });

  it("renders nothing if no projects are available", () => {
    renderWithRealStore([], "abc123");
    expect(screen.queryByText(/Project/i)).not.toBeInTheDocument();
  });
});
