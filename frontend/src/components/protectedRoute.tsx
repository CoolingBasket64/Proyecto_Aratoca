import { Navigate } from "react-router-dom";

// ProtectedRoute es un componente "envolvente" (wrapper) que protege rutas privadas.
// Se usa en App.tsx rodeando cada componente de pagina que requiere autenticacion:
//   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//
// Si el usuario intenta acceder a /dashboard sin estar logueado,
// ProtectedRoute lo redirige al inicio (/) antes de que el componente hijo se renderice.
export default function ProtectedRoute({ children }: any) {

  // Buscamos el token JWT en localStorage.
  // El token se guarda al hacer login exitoso y se elimina al cerrar sesion.
  // Si no hay token, el usuario no esta autenticado.
  const token = localStorage.getItem("token");

  // Si no hay token: Navigate redirige al usuario a la pagina de inicio.
  // "return" hace que el componente hijo (la pagina protegida) nunca se renderice.
  if (!token) {
    return <Navigate to="/" />;
  }

  // Si hay token: renderiza el componente hijo normalmente.
  // "children" es el componente de pagina que se paso entre las etiquetas de ProtectedRoute.
  return children;
}
