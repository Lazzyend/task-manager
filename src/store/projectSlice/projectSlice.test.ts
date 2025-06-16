import { ProjectType } from "../../components/Project/types";
import { TaskType } from "../../components/TaskCard/types";
import { Priority, Status } from "../../types";

import reducer, {
  addProject,
  addTask,
  deleteProject,
  deleteTask,
  ProjectsState,
  setItems,
  setSelectedProject,
  updateProject,
  updateTask,
} from "./projectSlice";

const sampleTask: TaskType = {
  id: "task-1",
  title: "Test Task",
  description: "Test Desc",
  priority: Priority.medium,
  status: Status.pending,
  dueDate: new Date().toISOString(),
};

const sampleProject: ProjectType = {
  id: "project-1",
  title: "Test Project",
  dueDate: "2025-01-01",
  tasks: [],
};

describe("projectSlice", () => {
  let initialState: ProjectsState;

  beforeEach(() => {
    initialState = {
      items: [],
      selectedProject: null,
    };
  });

  it("should set initial project list", () => {
    const action = setItems([sampleProject]);
    const state = reducer(initialState, action);
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe("project-1");
  });

  it("should set selected project", () => {
    const action = setSelectedProject("project-1");
    const state = reducer(initialState, action);
    expect(state.selectedProject).toBe("project-1");
  });

  it("should add a new project", () => {
    const action = addProject(sampleProject);
    const state = reducer(initialState, action);
    expect(state.items).toContainEqual(sampleProject);
  });

  it("should update a project", () => {
    const stateWithProject = {
      ...initialState,
      items: [sampleProject],
    };

    const updatedTitle = "Updated Title";
    const updatedDate = "2026-01-01";

    const action = updateProject({
      id: "project-1",
      title: updatedTitle,
      dueDate: updatedDate,
    });

    const state = reducer(stateWithProject, action);
    expect(state.items[0].title).toBe(updatedTitle);
    expect(state.items[0].dueDate).toBe(updatedDate);
  });

  it("should delete a project", () => {
    const stateWithProject = {
      ...initialState,
      items: [sampleProject],
    };

    const action = deleteProject("project-1");
    const state = reducer(stateWithProject, action);
    expect(state.items).toHaveLength(0);
  });

  it("should add a task to a project", () => {
    const stateWithProject = {
      ...initialState,
      items: [{ ...sampleProject }],
    };

    const action = addTask({
      projectId: "project-1",
      task: sampleTask,
    });

    const state = reducer(stateWithProject, action);
    expect(state.items[0].tasks).toHaveLength(1);
    expect(state.items[0].tasks[0].title).toBe("Test Task");
  });

  it("should update a task", () => {
    const stateWithProject = {
      ...initialState,
      items: [
        {
          ...sampleProject,
          tasks: [sampleTask],
        },
      ],
    };

    const action = updateTask({
      projectId: "project-1",
      task: { ...sampleTask, title: "Updated Task" },
    });

    const state = reducer(stateWithProject, action);
    expect(state.items[0].tasks[0].title).toBe("Updated Task");
  });

  it("should delete a task", () => {
    const stateWithProject = {
      ...initialState,
      items: [
        {
          ...sampleProject,
          tasks: [sampleTask],
        },
      ],
    };

    const action = deleteTask({
      projectId: "project-1",
      taskId: "task-1",
    });

    const state = reducer(stateWithProject, action);
    expect(state.items[0].tasks).toHaveLength(0);
  });
});
