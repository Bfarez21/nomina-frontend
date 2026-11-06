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

import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React examples
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Soft UI Dashboard React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Soft UI Dashboard React routes
import routes from "routes";

// Soft UI Dashboard React contexts
import { useSoftUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brand from "assets/images/logo-ct.png";

export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // 1. Verificar credenciales y rol de sesión
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
  const isSignInPage = pathname === "/authentication/sign-in" || !token;
  // 2. Determinar la ruta por defecto según si existe un token activo
  const initialRoute = token
    ? userRole === "ROLE_EMPLOYEE"
      ? "/marcacion-empleado"
      : "/dashboard"
    : "/authentication/sign-in";

  // 3. Filtrar rutas para el menú lateral
  const filteredRoutes = routes.filter((route) => {
    // Con sesión iniciada, ocultar Sign In y Sign Up del menú
    if (route.key === "sign-in" || route.key === "sign-up") {
      return false;
    }
    // oculta vistas a role employee
    if (userRole === "ROLE_EMPLOYEE") {
      return (
        route.key !== "dashboard" &&
        route.key !== "tables" &&
        route.key !== "empleados"
      );
    }
    return true;
  });

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  //con protected routes
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        const isPublic = route.route.startsWith("/authentication");

        let element = route.component;

        if (!token && !isPublic) {
          // Sin sesión: mandar al login
          element = <Navigate to="/authentication/sign-in" replace />;
        } else if (
          userRole === "ROLE_EMPLOYEE" &&
          (route.route === "/dashboard" ||
            route.route === "/tables" ||
            route.route === "/empleados")
        ) {
          // Empleado intentando acceder a pantallas de admin: redirigir a marcación
          element = <Navigate to="/marcacion-empleado" replace />;
        }

        return <Route exact path={route.route} element={element} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <SoftBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </SoftBox>
  );

  // Variable de control: ocultar Sidenav si no hay token o si estamos en /authentication/sign-in
  const isAuthPage = pathname === "/authentication/sign-in" || !token;

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && !isSignInPage && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={brand}
              brandName="Soft UI Nomina"
              routes={filteredRoutes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(routes)}
          <Route path="/" element={<Navigate to={initialRoute} replace />} />
          <Route path="*" element={<Navigate to={initialRoute} replace />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {layout === "dashboard" && !isSignInPage && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={brand}
            brandName="Soft UI Nomina"
            routes={filteredRoutes} // ruta filtrada
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(routes)}
        <Route path="/" element={<Navigate to={initialRoute} replace />} />
        <Route path="*" element={<Navigate to={initialRoute} replace />} />
      </Routes>
    </ThemeProvider>
  );
}
