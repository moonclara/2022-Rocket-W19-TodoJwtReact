import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TodoPage from "./pages/TodoPage";
import { AuthContext } from "./components/Context";
import { ProtectedRoute } from "./components/ProtectedRoute";

import "./App.css";

function App() {
  const [token, setToken] = useState(null);

  return (
    <div className="App">
      <AuthContext.Provider value={{ token, setToken }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* 用 setToken 更新 token 的值 */}
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/SignUpPage" element={<SignUpPage />} />
          {/* token 有值才能造訪 TodoPage */}
          <Route element={<ProtectedRoute />}>
            <Route path="/TodoPage" element={<TodoPage />} />
          </Route>
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
