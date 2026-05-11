import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Usuarios from './components/Usuarios';
import Comunidad from './components/Comunidad';
import MainLayout from './layouts/MainLayout';

// 1. IMPORTACIÓN DE COMPONENTES REALES CONECTADOS
import Soporte from './pages/Soporte'; 
import Collares from './components/Collares'; 
import IAControl from './pages/IAControl'; 
import PagosAdmin from './pages/PagosAdmin'; 
import ReportesMascotas from './pages/ReportesMascotas'; 
import AdminProfile from './pages/AdminProfile'; // 🆕 Importamos la nueva página de perfil

// Componente para proteger rutas
const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección raíz */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Privadas (Protegidas) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/comunidad" element={<Comunidad />} />
            
            {/* Gestión de IA */}
            <Route path="/ia" element={<IAControl />} />
            
            {/* Gestión de Collares IoT */}
            <Route path="/collares" element={<Collares />} />
            
            {/* Centro de Soporte Técnico */}
            <Route path="/soporte" element={<Soporte />} />
            
            {/* Control de Pagos y Suscripciones Premium */}
            <Route path="/pagos" element={<PagosAdmin />} />
            
            {/* Reportes de Mascotas Perdidas (lost_pets) */}
            <Route path="/reportes" element={<ReportesMascotas />} />

            {/* 🆕 NUEVA RUTA: Perfil del Administrador */}
            <Route path="/admin-profile" element={<AdminProfile />} />
          </Route>
        </Route>

        {/* Manejo de rutas inexistentes (Catch-all) */}
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