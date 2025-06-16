import reducer, {
  registerUser,
  loginUser,
  logoutUser,
  loadCurrentUser,
  setUsers,
} from "./authSlice";

describe("authSlice", () => {
  const initialState = {
    users: [],
    currentUser: null,
  };

  it("should handle initial state", () => {
    expect(reducer(undefined, { type: "" })).toEqual(initialState);
  });

  it("should register a new user", () => {
    const action = registerUser({ username: "test", password: "pass" });
    const state = reducer(initialState, action);

    expect(state.users.length).toBe(1);
    expect(state.users[0].username).toBe("test");
    expect(state.users[0].id).toBeDefined();
  });

  it("should not register user with existing username", () => {
    const existingState = {
      users: [{ username: "test", password: "pass", id: "1" }],
      currentUser: null,
    };
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const action = registerUser({ username: "test", password: "new" });
    const state = reducer(existingState, action);

    expect(state.users.length).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith("User exist");
    consoleSpy.mockRestore();
  });

  it("should login a valid user", () => {
    const stateWithUser = {
      users: [{ username: "admin", password: "12341234", id: "2" }],
      currentUser: null,
    };

    const action = loginUser({ username: "admin", password: "12341234" });
    const state = reducer(stateWithUser, action);

    expect(state.currentUser?.username).toBe("admin");
  });

  it("should not login with wrong credentials", () => {
    const stateWithUser = {
      users: [{ username: "admin", password: "12341234", id: "2" }],
      currentUser: null,
    };

    const action = loginUser({ username: "admin", password: "wrong" });
    const state = reducer(stateWithUser, action);

    expect(state.currentUser).toBe(null);
  });

  it("should logout user", () => {
    const loggedInState = {
      users: [],
      currentUser: { username: "admin", password: "12341234", id: "1" },
    };

    const state = reducer(loggedInState, logoutUser());

    expect(state.currentUser).toBe(null);
  });

  it("should load user from localStorage", () => {
    const user = { username: "saved", password: "secret", id: "99" };
    localStorage.setItem("authCurrentUser", JSON.stringify(user));

    const state = reducer(initialState, loadCurrentUser());

    expect(state.currentUser?.username).toBe("saved");
    localStorage.removeItem("authCurrentUser");
  });

  it("should set users via setUsers", () => {
    const payload = {
      users: [{ username: "u", password: "p" }],
      currentUser: null,
    };

    const state = reducer(initialState, setUsers(payload));

    expect(state.users).toEqual(payload.users);
  });
});
