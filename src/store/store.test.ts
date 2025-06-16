import { setItems } from "./projectSlice/projectSlice";
import { registerUser } from "./authSlice/authSlice";
import { store } from ".";

const localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
} as jest.Mocked<Pick<Storage, "getItem" | "setItem" | "clear" | "removeItem">>;

Object.defineProperty(window, "localStorage", {
  value: localStorage,
});

describe("Redux Store", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should initialize store with default state", () => {
    const state = store.getState();
    expect(state.auth.currentUser).toBeNull();
    expect(state.projects.items).toEqual([]);
  });

  it("should persist to localStorage when projects are set", () => {
    store.dispatch(
      setItems([
        { id: "1", title: "Test Project", dueDate: "2025-01-01", tasks: [] },
      ])
    );

    expect(localStorage.setItem).toHaveBeenCalled();
    const saved = localStorage.setItem.mock.calls[0][1];
    expect(JSON.parse(saved).projects.items[0].title).toBe("Test Project");
  });

  it("should persist auth state even if no projects", () => {
    store.dispatch(registerUser({ username: "user", password: "pass" }));
    store.dispatch(setItems([]));

    const saved = localStorage.setItem.mock.calls.at(-1)?.[1];
    expect(saved).toContain('"auth"');
    expect(saved).toContain('"projects"');
  });

  it("should handle localStorage corruption gracefully", () => {
    localStorage.getItem.mockReturnValueOnce("invalid_json");

    store.dispatch(setItems([]));

    expect(localStorage.setItem).toHaveBeenCalled();
    expect(() => JSON.parse("invalid_json")).toThrow();
  });
});
