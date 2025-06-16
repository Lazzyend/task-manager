import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ProjectPage from "./ProjectPage";
import { ProjectType } from "../types";

jest.mock(
  "../../TaskCard/TaskCard",
  () =>
    ({ item }: { item: ProjectType }) =>
      <div data-testid="project-card">{item.title}</div>
);

const mockStore = configureStore([]);

const project: ProjectType = {
  id: "123",
  title: "Test Project",
  dueDate: "2025-06-14",
  tasks: [],
};

const initialState = {
  projects: {
    items: [project],
    selectedProject: "123",
  },
};

const renderWithStore = (state = initialState) => {
  const store = mockStore(state);
  return render(
    <Provider store={store}>
      <ProjectPage />
    </Provider>
  );
};

describe("ProjectPage", () => {
  it("renders ProjectCard when selected project exists", () => {
    renderWithStore();
    expect(screen.getByTestId("project-card")).toHaveTextContent(
      "Test Project"
    );
  });

  it("renders nothing if selected project is not found", () => {
    const customState = {
      projects: {
        items: [project],
        selectedProject: "nonexistent",
      },
    };
    renderWithStore(customState);
    expect(screen.queryByTestId("project-card")).not.toBeInTheDocument();
  });

  it("renders nothing if no projects exist", () => {
    const customState = {
      projects: {
        items: [],
        selectedProject: "123",
      },
    };
    renderWithStore(customState);
    expect(screen.queryByTestId("project-card")).not.toBeInTheDocument();
  });
});
