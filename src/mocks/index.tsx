import { ProjectType } from "../components/Project/types";
import { TaskType } from "../components/TaskCard/types";
import { Priority, Status } from "../types";

export const MocksTask1: TaskType[] = [
  {
    id: "0",
    title: "Task 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    priority: Priority.high,
    status: Status.completed,
    dueDate: new Date("Thu Jun 12 2025 GMT+0300").toLocaleDateString(),
  },
  {
    id: "1",
    title: "Task 2",
    description:
      "Lorem Ipsum neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
    priority: Priority.medium,
    status: Status.inprogress,
    dueDate: new Date("Thu Jun 11 2025 GMT+0300").toLocaleDateString(),
  },
];

export const MocksTask2: TaskType[] = [
  {
    id: "0",
    title: "Task 3",
    description:
      "Lorem ipsum there is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain...",
    priority: Priority.low,
    status: Status.completed,
    dueDate: new Date("Thu Jun 10 2025 GMT+0300").toLocaleDateString(),
  },
  {
    id: "1",
    title: "Task 4",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing",
    priority: Priority.low,
    status: Status.pending,
    dueDate: new Date("Thu Jun 9 2025 GMT+0300").toLocaleDateString(),
  },
];

export const Mocks: ProjectType[] = [
  {
    id: "0",
    title: "Project 1",
    dueDate: new Date("Thu Jun 8 2025 GMT+0300").toLocaleDateString(),
    tasks: MocksTask1,
  },
  {
    id: "1",
    title: "Project 2",
    dueDate: new Date("Thu Jun 7 2025 GMT+0300").toLocaleDateString(),
    tasks: MocksTask2,
  },
];
