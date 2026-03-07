import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import CrearDiscapacitado from "./pages/crearDiscapacitado";
import EditarDiscapacitado from "./pages/editarDiscapacitado";
import InactivarDiscapacitado from "./pages/inactivarDiscapacitado";
import CrearAdmin from "./pages/crearAdmin";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crear-discapacitado" element={<CrearDiscapacitado />} />
        <Route path="/editar-discapacitado" element={<EditarDiscapacitado />} />
        <Route path="/inactivar-discapacitado" element={<InactivarDiscapacitado />} />
        <Route path="/crear-admin" element={<CrearAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;