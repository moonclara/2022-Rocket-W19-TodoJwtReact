import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./Context";

export const ProtectedRoute = () => {
  // 若 token 為空值就顯示首頁
  const { token } = useAuth();
  if (!token) {
    console.log(token);
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
