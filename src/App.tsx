import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import { Path } from "./types/path";
import HomePage from "./pages/HomePage";
import { Provider } from "react-redux";
import { store } from "./store";
import SecureRoute from "./components/Route/SecureRoute";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path={Path.LOGIN} element={<LoginPage />} />
          <Route element={<SecureRoute />}>
            <Route path={Path.HOME} element={<HomePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
