/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import {loginApi} from "../../../api/authService";
import { Alert } from "@mui/material";
import { setLayout, useSoftUIController } from "../../../context";

function SignIn() {
  const navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [, dispatch] = useSoftUIController();

  // Cambiar el layout global a "page" al cargar SignIn y restaurarlo a "dashboard" al salir
  useEffect(() => {
    setLayout(dispatch, "page");
    return () => setLayout(dispatch, "dashboard");
  }, [dispatch]);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const data = await loginApi({ username, password });

      if (data && data.token) {
        const storage = rememberMe ? localStorage : sessionStorage;

        // 1. Guardar en storage usando la estructura real del JSON del backend
        storage.setItem("token", data.token);
        storage.setItem("userRole", data.role);
        storage.setItem("userId", data.id);
        storage.setItem("username", data.username);

        console.log("Rol guardado exitosamente:", data.role);

        // 2. Redireccionar según la propiedad exacta data.role
        if (data.role === "ROLE_ADMIN") {
          navigate("/dashboard");
        } else if (data.role === "ROLE_EMPLOYEE") {
          navigate("/marcacion-empleado");
        } else {
          // Fallback en caso de que exista otro rol
          navigate("/dashboard");
        }
      } else {
        setErrorMessage("Respuesta inválida del servidor.");
      }
    } catch (error) {
      //console.error("Error en login:", error);
      setErrorMessage("Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoverLayout
      title="Bienvenido de nuevo"
      description="Ingresa tu usuario y contraseña para iniciar de nuevo"
      image={curved9}
    >
      <SoftBox component="form" role="form" onSubmit={handleSubmit}>
        {errorMessage && (
          <SoftBox mb={2}>
            <Alert severity={"error"}>{errorMessage}</Alert>
          </SoftBox>
        )}

        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Usuario / Email
            </SoftTypography>
          </SoftBox>

          <SoftInput
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </SoftBox>

        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Contraseña
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </SoftBox>

        <SoftBox display="flex" alignItems="center">
          <Switch checked={rememberMe} onChange={handleSetRememberMe} />
          <SoftTypography
            variant="button"
            fontWeight="regular"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;Recordarme
          </SoftTypography>
        </SoftBox>

        <SoftBox mt={4} mb={1}>
          <SoftButton type="submit" variant="gradient" color="info" fullWidth disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </SoftButton>
        </SoftBox>

        <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            ¿No tienes una cuenta?{" "}
            <SoftTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Registrarse
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default SignIn;
