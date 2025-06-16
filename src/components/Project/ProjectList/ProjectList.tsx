import { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Button, Space, Input, DatePicker, message } from "antd";
import dayjs from "dayjs";
import {
  addProject,
  updateProject,
  deleteProject,
  setSelectedProject,
} from "../../../store/projectSlice/projectSlice";
import { ProjectType } from "../types";
import { v4 as uuidv4 } from "uuid";

const ProjectList = () => {
  const dispatch = useDispatch();

  const projects = useSelector((state: RootState) => state.projects);

  const [messageApi, contextHolder] = message.useMessage();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [newlyCreatedProjectId, setNewlyCreatedProjectId] = useState<
    string | null
  >(null);

  const onSelect = (id: string) => {
    dispatch(setSelectedProject(id));
  };

  const handleAdd = () => {
    const id = uuidv4();
    const newProj: ProjectType = {
      id,
      title: "",
      dueDate: new Date().toISOString().split("T")[0],
      tasks: [],
    };
    dispatch(addProject(newProj));
    onSelect(id);
    setEditingId(id);
    setEditTitle("");
    setEditDueDate(newProj.dueDate);
    setNewlyCreatedProjectId(id);
  };

  const startEditing = (proj: ProjectType) => {
    setEditingId(proj.id);
    setEditTitle(proj.title);
    setEditDueDate(proj.dueDate);
  };

  const handleSave = (id: string) => {
    const trimmed = editTitle.trim();
    if (!trimmed) {
      messageApi.warning("Project name cannot be empty");
      return;
    }

    dispatch(updateProject({ id, title: trimmed, dueDate: editDueDate }));
    setEditingId(null);
    setNewlyCreatedProjectId(null);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteProject(id));
    if (editingId === id) setEditingId(null);
    if (newlyCreatedProjectId === id) setNewlyCreatedProjectId(null);
  };

  const sortedProjects = [...projects.items];
  if (newlyCreatedProjectId) {
    const idx = sortedProjects.findIndex((p) => p.id === newlyCreatedProjectId);
    if (idx > 0) {
      const [newProject] = sortedProjects.splice(idx, 1);
      sortedProjects.unshift(newProject);
    }
  }

  return (
    <Wrapper>
      {contextHolder}
      <Header>
        <HeaderText>PROJECTS</HeaderText>
        <Button onClick={handleAdd} disabled={!!editingId}>
          New Project
        </Button>
      </Header>

      <Body>
        {sortedProjects.map((item) =>
          editingId === item.id ? (
            <EditContainer key={item.id}>
              <Input
                value={editTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditTitle(e.target.value)
                }
                placeholder="Project Name"
              />
              <DatePicker<dayjs.Dayjs>
                value={dayjs(editDueDate)}
                onChange={(d) =>
                  setEditDueDate(d ? d.format("YYYY-MM-DD") : editDueDate)
                }
              />
              <Space size="middle">
                <Button type="primary" onClick={() => handleSave(item.id)}>
                  Save
                </Button>
                <Button
                  onClick={() => {
                    if (newlyCreatedProjectId === item.id) {
                      handleDelete(item.id);
                    } else {
                      setEditingId(null);
                    }
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </EditContainer>
          ) : (
            <ProjectItem
              data-testid={`project-${item.id}`}
              key={item.id}
              onClick={() => onSelect(item.id)}
              selected={projects.selectedProject === item.id}
            >
              <ItemInfo>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDate>
                  {new Date(item.dueDate).toLocaleDateString()}
                </ItemDate>
              </ItemInfo>
              <Space size="small">
                <Button size="small" onClick={() => startEditing(item)}>
                  Edit
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </Space>
            </ProjectItem>
          )
        )}
      </Body>
    </Wrapper>
  );
};

export default ProjectList;

const Wrapper = styled.div`
  width: 20%;
  min-width: 200px;
  background-color: #f4f6f8;
  padding: 1rem;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    align-self: flex-start;
    width: 100%;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
  }

  @media (max-width: 600px) {
    width: 100%;
    padding: 0.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
  }

  @media (max-width: 600px) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }
`;

const HeaderText = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  margin-right: 0.3rem;

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ProjectItem = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ selected }) => (selected ? "#cceeff" : "#fff")};
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 0.6rem;
  cursor: pointer;

  transition: background-color 0.2s;

  &:hover {
    background-color: #e6f7f9;
  }

  @media (max-width: 1024px) {
    align-self: flex-start;
    width: 100%;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.5rem;
    width: 100%;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  @media (max-width: 600px) {
    gap: 0.4rem;
    width: 100%;
  }
`;

const ItemTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: #222;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;

const ItemDate = styled.div`
  font-size: 0.8rem;
  color: #666;

  @media (max-width: 600px) {
    font-size: 0.75rem;
  }
`;

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;

  @media (max-width: 600px) {
    padding: 0.5rem;
  }
`;
