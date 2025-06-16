import { useCallback, useEffect } from "react";
import styled from "styled-components";
import ProjectList from "../components/Project/ProjectList/ProjectList";
import ProjectPage from "../components/Project/ProjectPage/ProjectPage";
import { getProjects } from "../api/getProjects";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { Path } from "../types/path";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { logoutUser } from "../store/authSlice/authSlice";
import { setItems } from "../store/projectSlice/projectSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = useCallback(async () => {
    const data = await getProjects();
    dispatch(setItems(data));
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [getData]);

  const username = useSelector(
    (state: RootState) => state.auth.currentUser?.username
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate(Path.LOGIN);
  };

  return (
    <Wrapper>
      <ProjectList />
      <ProjectPage />
      <UserInfo>
        <Username>User: {username}</Username>
        <Button onClick={handleLogout}>Logout</Button>
      </UserInfo>
    </Wrapper>
  );
};

export default HomePage;

const Wrapper = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  user-select: none;

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 0.75rem;
  }

  @media (max-width: 768px) {
    gap: 0.75rem;
    padding: 0.5rem;
  }
`;

const UserInfo = styled.div`
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
  background-color: #ffffff;
  height: 2rem;
  padding: 0.75rem;
  align-items: center;
  border-radius: 14px;

  @media (max-width: 1024px) {
    order: -1;
    margin-left: 0;
    margin-bottom: 1rem;
    width: 100%;
    justify-content: center;
  }

  @media (max-width: 600px) {
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    height: auto;
    justify-content: center;
  }
`;

const Username = styled.span`
  font-weight: 500;

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;
