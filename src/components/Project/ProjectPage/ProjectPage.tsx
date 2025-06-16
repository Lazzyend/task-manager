import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import TaskCard from "../../TaskCard/TaskCard";
import { ProjectType } from "../types";

const ProjectPage = () => {
  const projects = useSelector((state: RootState) => state.projects);
  const setSelectedProject = useSelector(
    (state: RootState) => state.projects.selectedProject
  );

  const filteredProject = projects.items.filter(
    (item) => item.id === setSelectedProject
  );

  return (
    <>
      {filteredProject.length > 0 && (
        <Wrapper>
          <Body>
            {filteredProject.map((item: ProjectType) => (
              <TaskCard key={item.id} item={item} />
            ))}
          </Body>
        </Wrapper>
      )}
    </>
  );
};
export default ProjectPage;

const Wrapper = styled.div``;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;
