import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Login from './Aplicacion/Public/inicioSesion';
import Inicio from './Aplicacion/Public/inicioSesionDe';
import Home from './Aplicacion/Public/home';
import FormularioEntrenador from './Aplicacion/Entrenador/entrenador';
import Deportista from './Aplicacion/Deportista/deportista';
import ForgotPassword from './Aplicacion/Public/olvidarContrasena';
import ResetPassword from './Aplicacion/Public/restablecerContrasena';
import DashboardEntrenador from './Components/Public/dashboardEntrenador';
import DashboardDeportista from './Components/Public/dashDeportista';
import VistaGeneralPlan from './Aplicacion/Entrenador/vistaGeneralplan';
import PlanEntrenamientoDeportista from './Aplicacion/Deportista/PlanEntrenamientoDeportista';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
     
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/inicio" element={<Login setUser={setUser} />} />
        <Route path="/inicioD" element={<Inicio setUser={setUser} />} />
        <Route path="/entrenador" element={<FormularioEntrenador />} />
        <Route path="/deportista" element={<Deportista />} />
        <Route path="/olvidarContrasena/:token" element={<ForgotPassword />} />
        <Route path="/restablecerContrasena/:token" element={<ResetPassword />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoutes user={user}/>}>
          <Route path="/dashEntrenador/*" element={<DashboardEntrenador />} />
          <Route path="/dashDeportista/*" element={<DashboardDeportista />} />
          <Route path="/visionGeneral/*" element={<VistaGeneralPlan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const ProtectedRoutes = ({ user, children }) => {
  if (!user) return <Navigate to="/" />;
  return children ? children : <Outlet />;
};

export default App;
