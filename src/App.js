import React from 'react';
import { Navigate, BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthContextProvider, useAuth } from './context/AuthContext'; // Adjust the import path accordingly
import Login from './pages/Login';
import Register from "./pages/Register";
import Home from './pages/Home';
import './style.scss';

function ProtectedRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/">
            <Route element={<ProtectedRoute />}>
              <Route index element={<Home />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
