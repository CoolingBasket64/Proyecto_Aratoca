import ProtectedRoute from "./components/protectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import PersonaFormulario from "./pages/personaFormulario";
import GestionarDiscapacitado from "./pages/gestionarDiscapacitado";
import CrearAdmin from "./pages/crearAdmin";
import GestionarAdmin from "./pages/gestionarAdmin";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 RUTAS PÚBLICAS */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* 🔒 RUTAS PROTEGIDAS */}
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/crear-discapacitado" element={<ProtectedRoute> <PersonaFormulario /></ProtectedRoute>} />

        <Route path="/editar/:id" element={<ProtectedRoute> <PersonaFormulario /> </ProtectedRoute>} />

        <Route path="/gestionar-discapacitado" element={<ProtectedRoute> <GestionarDiscapacitado /> </ProtectedRoute>} />

        <Route path="/crear-admin" element={<ProtectedRoute> <CrearAdmin /> </ProtectedRoute>} />
        <Route path="/gestionar-admin" element={<ProtectedRoute> <GestionarAdmin /> </ProtectedRoute>} />
        <Route path="/crear-admin/:id" element={<ProtectedRoute> <CrearAdmin /> </ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;