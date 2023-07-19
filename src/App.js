import React, { useContext } from 'react';
import { Navigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from "./pages/Register";
import Home from './pages/Home';
import './style.scss';
import { AuthContext, AuthContextProvider } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/">
            <Route element={<ProtectedRoute />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Route>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
