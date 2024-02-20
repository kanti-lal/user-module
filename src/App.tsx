import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoutes";
import SignUp from "./components/SignUp";
import { UserAuthContextProvider } from "./context/UserAuthContext";

function App() {
  return (
    <UserAuthContextProvider>
      <Routes>
      <Route
          path="/"
          element={
            <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={
        <Login />
        
        } />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </UserAuthContextProvider>
  );
}

export default App;
