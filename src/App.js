// App.js
import React, { useContext } from 'react';
import { Navigate, BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from "./pages/Register";
import Home from './pages/Home';
import './style.scss';
import AuthContext, { AuthProvider } from './context/AuthContext';

function ProtectedRoute() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
     
        <Routes>
          <Route path="/">
            <Route element={<ProtectedRoute />}>
              <Route index element={<Home />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
     
    </BrowserRouter>
  );
}

export default App;
