import { createContext, useContext } from 'react';

// 讓 Router 可以包裹在 AuthContext 裡面，共用 token 的值
export const AuthContext = createContext(null);

// 每個元件都可能需要取得或更新 token 的值，利用 useAuth 取出 token 及 setToken
export const useAuth = () => useContext(AuthContext);
