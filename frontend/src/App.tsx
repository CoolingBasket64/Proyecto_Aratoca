import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import PersonaFormulario from "./pages/personaFormulario";
import GestionarDiscapacitado from "./pages/gestionarDiscapacitado";
import CrearAdmin from "./pages/crearAdmin";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crear-discapacitado" element={<PersonaFormulario />} />
        <Route path="/editar/:id" element={<PersonaFormulario />} />
        <Route path="/gestionar-discapacitado" element={<GestionarDiscapacitado />} />
        <Route path="/crear-admin" element={<CrearAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;