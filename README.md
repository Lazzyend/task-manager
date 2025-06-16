# Welcome to Your Project Manager App!

This app was started with [Create React App](https://github.com/facebook/create-react-app).

## What Can You Do Here?

- **Sign up & log in** (mocked for demo)
- **Create and manage projects**
- **Add, edit, and delete tasks** inside projects
- **Filter tasks** and keep your data safe in your browser (localStorage)

## Tech Stack

- **React** (with hooks)
- **Redux Toolkit** for state
- **TypeScript** for type safety
- **Styled Components** for CSS-in-JS
- **Ant Design (antd)** for UI
- **Jest & React Testing Library** for tests

## Project Structure

```
src/
├── api/                # Simulated auth API (localStorage + setTimeout)
├── components/
│   ├── TaskCard/
│   │   ├── TaskCard.tsx
│   │   └── types.ts
│   └── Project/
│       └── types.ts
├── pages/
│   ├── LoginPage.tsx
│   └── HomePage.tsx
├── store/
│   ├── authSlice/
│   │   └── authSlice.ts
│   ├── projectSlice.ts
│   └── index.ts        # Redux store setup
└── types/
   └── path.ts       # Route constants
```

## How State Looks

```ts
{
   auth: {
   users: Array<{ username: string, password: string }>,
   currentUser: { username: string } | null
   },
   projects: {
   items: Array<Project>,
   selectedProject: string | null
   }
}
```

### Project Example

```ts
{
   id: string;
   title: string;
   dueDate: string;
   tasks: Array<Task>;
}
```

### Task Example

```ts
{
   id: string;
   title: string;
   description: string;
   priority: "low" | "medium" | "high";
   status: "pending" | "in-progress" | "completed";
   dueDate: string;
}
```

## Getting Started

1. **Clone & Install**
    ```sh
    git clone <repo-url>
    cd project-folder
    npm install
    ```

2. **Start the App**
    ```sh
    npm start
    ```

3. **Run Tests**
    ```sh
    npm test
    ```

## Testing

- Unit tests for reducers, forms, and logic
- Integration tests for user actions (login, forms)
- LocalStorage is mocked and checked in Redux tests

**Example:**

```js
it("can submit task form", () => {
   render(<TaskForm ... />);
   fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "Task 1" } });
   fireEvent.click(screen.getByRole("button", { name: /save/i }));
   expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ title: "Task 1" }));
});
```

## Persistence

- Projects and auth info are saved in localStorage
- State is restored when you reload

## Authentication

- Simple mock login/signup (no real backend)
- Users are stored in Redux and localStorage

---

Want to learn more about React? Check out the [React docs](https://reactjs.org/).
