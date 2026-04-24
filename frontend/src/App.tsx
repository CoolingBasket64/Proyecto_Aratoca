// ProtectedRoute es el componente que protege las rutas privadas
import ProtectedRoute from "./components/protectedRoute";
// BrowserRouter maneja el historial del navegador para la navegacion
// Routes agrupa todas las rutas, Route define cada pagina y su URL
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importa todos los componentes de pagina
import Home from "./pages/home";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import PersonaFormulario from "./pages/personas/personaFormulario";
import GestionarDiscapacitado from "./pages/personas/gestionarDiscapacitado";
import CrearAdmin from "./pages/usuarios/crearAdmin";
import GestionarAdmin from "./pages/usuarios/gestionarAdmin";
import Reportes from "./pages/reportes";

import "./App.css";

function App() {
  return (
    // BrowserRouter envuelve toda la app para habilitar el sistema de rutas
    <BrowserRouter>
      <Routes>

        {/* Rutas publicas: cualquier usuario puede acceder sin estar autenticado */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas: ProtectedRoute verifica si hay sesion activa.
            Si no hay sesion, redirige al inicio en lugar de mostrar la pagina */}
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />

        {/* La misma pagina PersonaFormulario se usa para crear y editar.
            Cuando la URL tiene :id es edicion, cuando no lo tiene es creacion */}
        <Route path="/crear-discapacitado" element={<ProtectedRoute> <PersonaFormulario /></ProtectedRoute>} />
        <Route path="/editar/:id" element={<ProtectedRoute> <PersonaFormulario /> </ProtectedRoute>} />

        <Route path="/gestionar-discapacitado" element={<ProtectedRoute> <GestionarDiscapacitado /> </ProtectedRoute>} />

        {/* Igual que personas: el mismo formulario sirve para crear y editar admin */}
        <Route path="/crear-admin" element={<ProtectedRoute> <CrearAdmin /> </ProtectedRoute>} />
        <Route path="/crear-admin/:id" element={<ProtectedRoute> <CrearAdmin /> </ProtectedRoute>} />
        <Route path="/gestionar-admin" element={<ProtectedRoute> <GestionarAdmin /> </ProtectedRoute>} />

        <Route path="/reportes" element={<ProtectedRoute> <Reportes /> </ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
