// ProtectedRoute es el componente que envuelve las rutas privadas.
// Si el usuario no tiene token, redirige a "/" antes de renderizar la pagina.
import ProtectedRoute from "./components/protectedRoute";

// React Router maneja la navegacion entre paginas sin recargar el navegador (Single Page Application).
// BrowserRouter: usa la API de historial del navegador (URLs limpias como /dashboard).
// Routes: contenedor de todas las rutas de la aplicacion.
// Route: define una ruta con su URL (path) y el componente que muestra (element).
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importa todos los componentes de pagina
import Home                   from "./pages/home";
import Login                  from "./pages/login";
import Dashboard              from "./pages/dashboard";
import PersonaFormulario      from "./pages/personas/personaFormulario";
import GestionarDiscapacitado from "./pages/personas/gestionarDiscapacitado";
import CrearAdmin             from "./pages/usuarios/crearAdmin";
import GestionarAdmin         from "./pages/usuarios/gestionarAdmin";
import Reportes               from "./pages/reportes";
import ResetPassword          from "./pages/ResetPassword";

import "./App.css";

function App() {
  return (
    // BrowserRouter debe envolver toda la app para que React Router funcione en cualquier componente
    <BrowserRouter>
      <Routes>

        {/* ── RUTAS PUBLICAS ──────────────────────────────────────────────────
            Cualquier visitante puede acceder sin estar autenticado. */}
        <Route path="/"      element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ── RUTAS PRIVADAS ──────────────────────────────────────────────────
            Cada pagina esta envuelta en ProtectedRoute.
            Si no hay token en localStorage, ProtectedRoute redirige a "/" automaticamente
            sin llegar a renderizar el componente hijo. */}

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        {/* La misma pagina PersonaFormulario maneja tanto creacion como edicion.
            Cuando la URL tiene :id es edicion (/editar/5), cuando no lo tiene es creacion (/crear-discapacitado). */}
        <Route path="/crear-discapacitado" element={
          <ProtectedRoute><PersonaFormulario /></ProtectedRoute>
        } />
        <Route path="/editar/:id" element={
          <ProtectedRoute><PersonaFormulario /></ProtectedRoute>
        } />

        <Route path="/gestionar-discapacitado" element={
          <ProtectedRoute><GestionarDiscapacitado /></ProtectedRoute>
        } />

        {/* Igual que personas: el mismo componente CrearAdmin sirve para crear (/crear-admin)
            y editar (/crear-admin/5). El :id opcional determina el modo. */}
        <Route path="/crear-admin"     element={<ProtectedRoute><CrearAdmin /></ProtectedRoute>} />
        <Route path="/crear-admin/:id" element={<ProtectedRoute><CrearAdmin /></ProtectedRoute>} />

        <Route path="/gestionar-admin" element={
          <ProtectedRoute><GestionarAdmin /></ProtectedRoute>
        } />

        <Route path="/reportes" element={
          <ProtectedRoute><Reportes /></ProtectedRoute>
        } />
        <Route path="/reset-password" element={<ResetPassword />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
