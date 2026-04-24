import { Navigate } from "react-router-dom";

// Componente que protege rutas privadas verificando si hay una sesion activa.
// Recibe "children" que es el componente de la pagina que se quiere proteger.
export default function ProtectedRoute({ children }: any) {

  // localStorage es un almacenamiento del navegador que persiste aunque se recargue la pagina.
  // Al hacer login se guarda el usuario ahi, y aqui se verifica si existe ese dato.
  const usuario = localStorage.getItem("usuario");

  // Si no hay usuario guardado, redirige al inicio usando el componente Navigate
  // En lugar de renderizar la pagina protegida, renderiza la redireccion
  if (!usuario) {
    return <Navigate to="/" />;
  }

  // Si hay sesion activa, renderiza el componente hijo (la pagina solicitada)
  return children;
}
