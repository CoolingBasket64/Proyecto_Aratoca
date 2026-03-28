import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {

  const usuario = localStorage.getItem("usuario");

  if (!usuario) {
    return <Navigate to="/" />;
  }

  return children;
}