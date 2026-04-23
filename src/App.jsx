import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';

// Componente para proteger rutas
const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    // Si no hay token, manda al login. Si hay, muestra el contenido (Outlet)
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La ruta principal ahora es el Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Privadas con el Sidebar y Navbar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<UserManagement />} /> 
          </Route>
        </Route>

        {/* Redirigir cualquier otra ruta al login por ahora */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;