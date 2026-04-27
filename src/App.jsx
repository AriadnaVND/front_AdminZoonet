import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Usuarios from './components/Usuarios';
import Comunidad from './components/Comunidad';
import MainLayout from './layouts/MainLayout';

// Componente para proteger rutas
const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// Componente temporal para secciones en desarrollo
const Placeholder = ({ title }) => (
    <div className="p-10 text-white bg-slate-900 h-full rounded-3xl border border-slate-800">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-400">Esta sección está en desarrollo para el panel administrativo de Zoonet.</p>
    </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Redirección explícita de la raíz al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 2. Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 3. Rutas Privadas (Protegidas) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/comunidad" element={<Comunidad />} />
            <Route path="/ia" element={<Comunidad />} />
            
            {/* Rutas del Sidebar con Placeholder */}
            <Route path="/pagos" element={<Placeholder title="Control de Pagos" />} />
            <Route path="/collares" element={<Placeholder title="Gestión de Collares" />} />
            <Route path="/reportes" element={<Placeholder title="Reportes del Sistema" />} />
            <Route path="/soporte" element={<Placeholder title="Tickets de Soporte" />} />
          </Route>
        </Route>

        {/* 4. Manejo de rutas inexistentes (404 / Catch-all) */}
        <Route 
            path="*" 
            element={
                localStorage.getItem('token') 
                ? <Navigate to="/dashboard" replace /> 
                : <Navigate to="/login" replace />
            } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;