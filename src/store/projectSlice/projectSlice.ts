import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskType } from "../../components/TaskCard/types";
import { ProjectType } from "../../components/Project/types";

export type ProjectsState = {
  items: ProjectType[];
  selectedProject: string | null;
};

const initialState: ProjectsState = {
  items: [],
  selectedProject: null,
};
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<ProjectType[]>) {
      state.items = action.payload;
    },
    setSelectedProject(state, action: PayloadAction<string | null>) {
      state.selectedProject = action.payload;
    },
    addTask: (
      state,
      { payload }: PayloadAction<{ projectId: string; task: TaskType }>
    ) => {
      const project = state.items.find((p) => p.id === payload.projectId);
      if (project) {
        project.tasks.push(payload.task);
      }
    },
    updateTask: (
      state,
      { payload }: PayloadAction<{ projectId: string; task: TaskType }>
    ) => {
      const project = state.items.find((p) => p.id === payload.projectId);
      if (project) {
        const idx = project.tasks.findIndex((t) => t.id === payload.task.id);
        if (idx !== -1) {
          project.tasks[idx] = payload.task;
        }
      }
    },
    deleteTask: (
      state,
      { payload }: PayloadAction<{ projectId: string; taskId: string }>
    ) => {
      const project = state.items.find((p) => p.id === payload.projectId);
      if (project) {
        project.tasks = project.tasks.filter(
          (task: TaskType) => task.id !== payload.taskId
        );
      }
    },
    addProject: (state, { payload }: PayloadAction<ProjectType>) => {
      state.items.push(payload);
    },
    updateProject: (
      state,
      { payload }: PayloadAction<{ id: string; title: string; dueDate: string }>
    ) => {
      const project = state.items.find((p) => p.id === payload.id);
      if (project) {
        project.title = payload.title;
        project.dueDate = payload.dueDate;
      }
    },
    deleteProject: (state, { payload }: PayloadAction<string>) => {
      const idx = state.items.findIndex((p) => p.id === payload);
      if (idx !== -1) {
        state.items.splice(idx, 1);
      }
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  addProject,
  updateProject,
  deleteProject,
  setItems,
  setSelectedProject,
} = projectSlice.actions;

export default projectSlice.reducer;
