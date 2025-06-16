import { Priority, Status } from "../../types";

export type TaskType = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
};
