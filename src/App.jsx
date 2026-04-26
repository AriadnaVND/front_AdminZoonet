import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Usuarios from './components/Usuarios';
import MainLayout from './layouts/MainLayout';

// Componente para proteger rutas
const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// Componente temporal para secciones que aún no creas
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
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Privadas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />

            {/* Aquí registramos TODAS las rutas que pusiste en tu Sidebar */}
            
            <Route path="/pagos" element={<Placeholder title="Control de Pagos" />} />
            <Route path="/comunidad" element={<Placeholder title="Foros y Comunidad" />} />
            <Route path="/ia" element={<Placeholder title="Análisis con IA" />} />
            <Route path="/collares" element={<Placeholder title="Gestión de Collares" />} />
            <Route path="/reportes" element={<Placeholder title="Reportes del Sistema" />} />
            <Route path="/soporte" element={<Placeholder title="Tickets de Soporte" />} />
          </Route>
        </Route>

        {/* Si el usuario intenta ir a una ruta que no existe */}
        {/* Si hay token, lo dejamos en el dashboard, si no, al login */}
        <Route path="*" element={localStorage.getItem('token') ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;