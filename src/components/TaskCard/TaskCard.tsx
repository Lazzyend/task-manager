import React, { useState, useMemo } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { Button, Input, Select, DatePicker, Space } from "antd";
import {
  addTask,
  deleteTask,
  updateTask,
} from "../../store/projectSlice/projectSlice";
import { ProjectType } from "../Project/types";
import { TaskType } from "./types";
import { Priority, Status } from "../../types";

const { Option, OptGroup } = Select;
const priorityOrder: Priority[] = [
  Priority.high,
  Priority.medium,
  Priority.low,
];
const statusOrder: Status[] = [
  Status.pending,
  Status.inprogress,
  Status.completed,
];

type SortKey = "" | "priority" | "status";

const Task: React.FC<{ item: ProjectType }> = ({ item }) => {
  const dispatch = useDispatch();
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("");

  const handleAdd = () => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const newTask: TaskType = {
      id,
      title: "",
      description: "",
      priority: Priority.medium,
      status: Status.pending,
      dueDate: new Date().toISOString(),
    };
    dispatch(addTask({ projectId: item.id, task: newTask }));
    setEditingTask(newTask);
    setNewlyCreatedId(id);
  };

  const handleEdit = (task: TaskType) => {
    setEditingTask({ ...task });
    setNewlyCreatedId(null);
  };

  const handleSave = (task: TaskType) => {
    dispatch(updateTask({ projectId: item.id, task }));
    setEditingTask(null);
    setNewlyCreatedId(null);
  };

  const handleCancel = (id: string) => {
    if (newlyCreatedId === id) {
      dispatch(deleteTask({ projectId: item.id, taskId: id }));
      setNewlyCreatedId(null);
    }
    setEditingTask(null);
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    editingTask &&
    setEditingTask(
      (prev) => prev && { ...prev, [e.target.name]: e.target.value }
    );

  const onSelect = (
    key: keyof Pick<TaskType, "priority" | "status">,
    val: string
  ) => editingTask && setEditingTask((prev) => prev && { ...prev, [key]: val });
  const onDate = (d: dayjs.Dayjs | null) =>
    editingTask &&
    setEditingTask(
      (prev) =>
        prev && {
          ...prev,
          dueDate: d?.toISOString() || new Date().toISOString(),
        }
    );

  const groupByStatusAndPriority = useMemo(() => {
    const initialGroups: Record<string, TaskType[]> = {
      [Priority.high]: [],
      [Priority.medium]: [],
      [Priority.low]: [],
      [Status.pending]: [],
      [Status.completed]: [],
      [Status.inprogress]: [],
      ALL: [],
    };

    const groups = item.tasks.reduce(
      (acc, task) => {
        acc[task.priority].push(task);
        acc[task.status].push(task);
        acc.ALL.push(task);
        return acc;
      },
      { ...initialGroups }
    );

    const sortByPriority = (a: TaskType, b: TaskType) => {
      const pa = priorityOrder.indexOf(a.priority);
      const pb = priorityOrder.indexOf(b.priority);
      if (pa !== pb) return pa - pb;
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    };

    const sortByStatus = (a: TaskType, b: TaskType) => {
      const sa = statusOrder.indexOf(a.status);
      const sb = statusOrder.indexOf(b.status);
      if (sa !== sb) return sa - sb;
      return (
        priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
      );
    };

    Object.keys(groups).forEach((key) => {
      if (sortKey === "priority") {
        groups[key] = [...groups[key]].sort(sortByPriority);
      } else if (sortKey === "status") {
        groups[key] = [...groups[key]].sort(sortByStatus);
      }
    });

    if (newlyCreatedId) {
      Object.values(groups).forEach((list) => {
        const idx = list.findIndex((t) => t.id === newlyCreatedId);
        if (idx > 0) {
          list.unshift(list.splice(idx, 1)[0]);
        }
      });
    }

    return groups;
  }, [item.tasks, sortKey, newlyCreatedId]);

  const displayList =
    groupByStatusAndPriority[
      filterValue as keyof typeof groupByStatusAndPriority
    ] || [];

  return (
    <Wrapper>
      <Header>
        <Title>{item.title}</Title>
        <Button disabled={!!editingTask} onClick={handleAdd}>
          New Task
        </Button>
      </Header>
      <Controls>
        <div>Due: {new Date(item.dueDate).toLocaleDateString()}</div>
        <SortAndFilterWrapper>
          {" Filter: "}
          <Select
            value={filterValue}
            onChange={setFilterValue}
            style={{ width: 130 }}
          >
            <Option value="ALL">All</Option>
            <OptGroup label="Priority">
              <Option value={Priority.high}>High</Option>
              <Option value={Priority.medium}>Medium</Option>
              <Option value={Priority.low}>Low</Option>
            </OptGroup>
            <OptGroup label="Status">
              <Option value={Status.pending}>Pending</Option>
              <Option value={Status.inprogress}>In-Progress</Option>
              <Option value={Status.completed}>Completed</Option>
            </OptGroup>
          </Select>
          {" Sort: "}
          <Select
            value={sortKey}
            onChange={(v: SortKey) => setSortKey(v)}
            style={{ width: 80 }}
          >
            <Option value="">None</Option>
            <Option value="priority">Priority</Option>
            <Option value="status">Status</Option>
          </Select>
        </SortAndFilterWrapper>
      </Controls>
      <TaskList>
        {displayList.map((task) => {
          const editing = editingTask?.id === task.id;
          return (
            <TaskCard key={task.id} selected={editing}>
              {editing ? (
                <>
                  <TaskTitle>
                    <Input
                      name="title"
                      value={editingTask!.title}
                      onChange={onInput}
                      placeholder="Title"
                      style={{ flex: 1, marginRight: "0.5rem" }}
                    />
                    <Space>
                      <Button
                        type="primary"
                        onClick={() => handleSave(editingTask!)}
                      >
                        Save
                      </Button>
                      <Button onClick={() => handleCancel(task.id)}>
                        Cancel
                      </Button>
                    </Space>
                  </TaskTitle>

                  <TaskDescription>
                    <Input
                      name="description"
                      value={editingTask!.description}
                      onChange={onInput}
                      placeholder="Description"
                    />
                  </TaskDescription>

                  <InfoGroup>
                    <Select<Priority>
                      value={editingTask!.priority}
                      onChange={(v: Priority) => onSelect("priority", v)}
                      style={{ width: "auto" }}
                    >
                      {priorityOrder.map((p) => (
                        <Option key={p} value={p}>
                          {p}
                        </Option>
                      ))}
                    </Select>

                    <Select<Status>
                      value={editingTask!.status}
                      onChange={(v: Status) => onSelect("status", v)}
                      style={{ width: "auto" }}
                    >
                      {statusOrder.map((s) => (
                        <Option key={s} value={s}>
                          {s}
                        </Option>
                      ))}
                    </Select>

                    <DatePicker
                      value={dayjs(editingTask!.dueDate)}
                      onChange={onDate}
                      style={{ width: "auto" }}
                    />
                  </InfoGroup>
                </>
              ) : (
                <>
                  <TaskTitle>
                    <TitleWrapper>{task.title}</TitleWrapper>
                    <Space>
                      <Button onClick={() => handleEdit(task)}>Edit</Button>
                      <Button
                        danger
                        onClick={() =>
                          dispatch(
                            deleteTask({ projectId: item.id, taskId: task.id })
                          )
                        }
                      >
                        Delete
                      </Button>
                    </Space>
                  </TaskTitle>
                  <TaskDescription>{task.description}</TaskDescription>
                  <InfoGroup>
                    <Info>{task.priority}</Info>
                    <Info>{task.status}</Info>
                    <Info>{new Date(task.dueDate).toLocaleDateString()}</Info>
                  </InfoGroup>
                </>
              )}
            </TaskCard>
          );
        })}
      </TaskList>
    </Wrapper>
  );
};
export default Task;

const Wrapper = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 43.75rem;
  margin: 0 auto;
  min-width: 28.875rem;

  @media (max-width: 1024px) {
    max-width: 90%;
    min-width: auto;
    padding: 1.25rem;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0.5rem 0;
    border-radius: 0;
    padding: 1rem;
  }
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const Title = styled.h2`
  font-size: 1.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;
const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const SortAndFilterWrapper = styled.div`
  @media (max-width: 600px) {
    width: 100%;
    margin-top: 0.5rem;
  }
`;
const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;
const TaskCard = styled.div<{ selected: boolean }>`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1rem;
  background-color: ${(p) => (p.selected ? "#fffbe6" : "#f9f9f9")};

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;
const TaskTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex: 1;
  min-width: 0;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const TaskDescription = styled.div`
  font-size: 0.95rem;
  color: #444;
  margin-bottom: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;
const InfoGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;
const Info = styled.div`
  padding: 0.3rem 0.8rem;
  background: #ddd;
  border-radius: 16px;
  font-size: 0.8rem;

  @media (max-width: 600px) {
    font-size: 0.75rem;
  }
`;

const TitleWrapper = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
`;
