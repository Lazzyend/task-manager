import { TaskType } from "../TaskCard/types";

export type ProjectType = {
  id: string;
  title: string;
  dueDate: string;
  tasks: TaskType[];
};
