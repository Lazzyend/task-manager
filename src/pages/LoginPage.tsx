import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  loginUser,
  setUsers,
} from "../store/authSlice/authSlice";
import { useNavigate } from "react-router-dom";
import { Path } from "../types/path";
import { getUser } from "../api/auth";
import { usersSelector } from "../store/authSlice/authSelector";

const LoginPage = () => {
  const dispatch = useDispatch();
  const users = useSelector(usersSelector);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [messageApi, contextHolder] = message.useMessage();

  const fetchUsers = useCallback(async () => {
    const data = await getUser();
    dispatch(setUsers(data));
  }, [dispatch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const navigate = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRegister = useCallback(() => {
    if (password.length < 8) {
      messageApi.warning("Password must contain at least 8 characters");
      return;
    }
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      messageApi.warning("User with such login already exists");
      return;
    }
    messageApi.success("User was successfully created");
    dispatch(registerUser({ username, password }));
  }, [dispatch, messageApi, password, username, users]);

  const handleLogin = () => {
    const existingUser = users.find((u) => u.username === username);
    if (!existingUser) {
      messageApi.warning("User does not exist");
      return;
    }
    if (existingUser && password !== existingUser.password) {
      messageApi.warning("Wrong password");
      return;
    }
    dispatch(loginUser({ username, password }));
    navigate(Path.HOME);
  };

  return (
    <Wrapper>
      {contextHolder}
      <Content>
        <Header>Login</Header>
        <Body>
          <Text>Username</Text>
          <Input
            id="username-input"
            name="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter username"
          />

          <Text>Password</Text>
          <Input.Password
            id="password-input"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
          />

          <ButtonContainer>
            <ActionButton type="primary" onClick={handleLogin}>
              Login
            </ActionButton>
            <ActionButton type="default" onClick={handleRegister}>
              Register
            </ActionButton>
          </ButtonContainer>
        </Body>
      </Content>
    </Wrapper>
  );
};

export default LoginPage;

const Wrapper = styled.div`
  margin-top: 6rem;
  display: flex;
  justify-content: center;

  @media (max-width: 600px) {
    margin-top: 3rem;
    padding: 0 1rem;
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 600px) {
    max-width: 100%;
    padding: 0.75rem;
  }
`;

const Header = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 600px) {
    gap: 0.75rem;
  }
`;

const Text = styled.label`
  font-weight: 500;
  font-size: 1rem;

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ActionButton = styled(Button)`
  flex: 1;
  width: auto;

  @media (max-width: 600px) {
    width: 100%;
  }
`;
