import { createContext, useContext, useState } from "react";
import axios from "@/config/api";

// Create Auth Context to store auth state
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Auth Provider component to wrap the app and provide auth state
// children is a prop that represents the nested components
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        if(localStorage.getItem('token')){
            return localStorage.getItem('token');
        }
        else {
            return null;
        }
    });

    const onRegister = async (data) => {
  const options = {
    method: "POST",
    url: "/register",
    data,
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);

    // Save token so user is logged in immediately
    localStorage.setItem("token", response.data.token);
    setToken(response.data.token);

    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

    const onLogin = async (email, password) => {
        const options = {
            method: "POST",
            url: "/login",
            data: {
                email,
                password
            }
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            setToken(response.data.token);

        } catch (err) {
            console.log(err.response.data);
        }
    };

    const onLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    const value = {
        token,
        onLogin,
        onRegister,
        onLogout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

};