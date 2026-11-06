import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SignOut() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Limpiar todo lo almacenado en la sesión (localStorage y sessionStorage)
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userRole");

    // O bien, si no guardas datos ajenos a la app:
    // localStorage.clear();
    // sessionStorage.clear();

    // 2. Redirigir al inicio de sesión
    navigate("/authentication/sign-in", { replace: true });
  }, [navigate]);

  return null;
}

export default SignOut;
