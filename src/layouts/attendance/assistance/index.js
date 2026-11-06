import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";

// Soft UI Dashboard React components
import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import SoftButton from "../../../components/SoftButton";
import SoftBadge from "../../../components/SoftBadge";
import SoftAlert from "../../../components/SoftAlert";

// Layout components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";

// Servidores API
import { registerClock, getTodayAttendance } from "../../../api/attendanceService";

function EmpleadoMarcacion() {
  const [todayClocks, setTodayClocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [currentTime, setCurrentTime] = useState(new Date());

  const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

  // Reloj digital en vivo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const loadTodayAttendance = async () => {
    if (!userId) return;
    try {
      const data = await getTodayAttendance(userId, getLocalDateString());
      setTodayClocks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar marcaciones:", err);
    }
  };

  useEffect(() => {
    loadTodayAttendance();
  }, [userId]);

  const handleRegisterClock = async (actionType = null) => {
    if (!userId) {
      setMessage({ type: "error", text: "No se encontró la sesión del usuario." });
      return;
    }
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await registerClock(userId, actionType);
      setMessage({ type: "success", text: "¡Marcación registrada correctamente!" });
      loadTodayAttendance();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Error al registrar la marcación." });
    } finally {
      setLoading(false);
    }
  };

  const formatTimeString = (isoString) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        {message.text && (
          <SoftBox mb={3}>
            <SoftAlert
              color={message.type === "error" ? "error" : "success"}
              dismissible
              onClose={() => setMessage({ type: "", text: "" })}
            >
              {message.text}
            </SoftAlert>
          </SoftBox>
        )}

        <Grid container spacing={3} justifyContent="center">
          {/* Tarjeta Principal de Marcación */}
          <Grid item xs={12} md={7} lg={6}>
            <Card sx={{ overflow: "visible" }}>
              <SoftBox p={3} textAlign="center">
                {/* Reloj y Fecha Actual */}
                <SoftBox
                  bgColor="info"
                  variant="gradient"
                  borderRadius="lg"
                  p={3}
                  mx={2}
                  mt={-5}
                  shadow="badge"
                  color="white"
                >
                  <SoftTypography variant="h2" color="white" fontWeight="bold">
                    {currentTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </SoftTypography>
                  <SoftTypography variant="button" color="white" fontWeight="medium" opacity={0.9}>
                    {currentTime.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </SoftTypography>
                </SoftBox>

                <SoftBox mt={3} mb={1}>
                  <SoftTypography variant="h5" fontWeight="bold">
                    Panel de Marcación
                  </SoftTypography>
                  <SoftTypography variant="caption" color="text">
                    Selecciona el tipo de evento a registrar en tu jornada
                  </SoftTypography>
                </SoftBox>

                <Divider />

                {/* Botón Principal / Acción Rápida */}
                <SoftBox my={3}>
                  <SoftButton
                    variant="gradient"
                    color="info"
                    size="large"
                    fullWidth
                    onClick={() => handleRegisterClock()}
                    disabled={loading}
                    sx={{ py: 1.5, fontSize: "1rem" }}
                  >
                    <Icon sx={{ mr: 1 }}>fingerprint</Icon>
                    {loading ? "Registrando..." : "MARCAR ASISTENCIA AHORA"}
                  </SoftButton>
                </SoftBox>

                {/* Accesos Rápidos por Tipo de Evento */}
                {/*<Grid container spacing={2}>*/}
                {/*  <Grid item xs={6}>*/}
                {/*    <SoftButton*/}
                {/*      variant="outlined"*/}
                {/*      color="success"*/}
                {/*      fullWidth*/}
                {/*      size="small"*/}
                {/*      disabled={loading}*/}
                {/*      onClick={() => handleRegisterClock("CLOCK_IN")}*/}
                {/*    >*/}
                {/*      <Icon sx={{ mr: 0.5 }}>login</Icon> Entrada*/}
                {/*    </SoftButton>*/}
                {/*  </Grid>*/}
                {/*  <Grid item xs={6}>*/}
                {/*    <SoftButton*/}
                {/*      variant="outlined"*/}
                {/*      color="error"*/}
                {/*      fullWidth*/}
                {/*      size="small"*/}
                {/*      disabled={loading}*/}
                {/*      onClick={() => handleRegisterClock("CLOCK_OUT")}*/}
                {/*    >*/}
                {/*      <Icon sx={{ mr: 0.5 }}>logout</Icon> Salida*/}
                {/*    </SoftButton>*/}
                {/*  </Grid>*/}
                {/*  <Grid item xs={6}>*/}
                {/*    <SoftButton*/}
                {/*      variant="outlined"*/}
                {/*      color="warning"*/}
                {/*      fullWidth*/}
                {/*      size="small"*/}
                {/*      disabled={loading}*/}
                {/*      onClick={() => handleRegisterClock("LUNCH_OUT")}*/}
                {/*    >*/}
                {/*      <Icon sx={{ mr: 0.5 }}>restaurant</Icon> Salida Almuerzo*/}
                {/*    </SoftButton>*/}
                {/*  </Grid>*/}
                {/*  <Grid item xs={6}>*/}
                {/*    <SoftButton*/}
                {/*      variant="outlined"*/}
                {/*      color="info"*/}
                {/*      fullWidth*/}
                {/*      size="small"*/}
                {/*      disabled={loading}*/}
                {/*      onClick={() => handleRegisterClock("LUNCH_IN")}*/}
                {/*    >*/}
                {/*      <Icon sx={{ mr: 0.5 }}>free_breakfast</Icon> Regreso Almuerzo*/}
                {/*    </SoftButton>*/}
                {/*  </Grid>*/}
                {/*</Grid>*/}
              </SoftBox>
            </Card>
          </Grid>

          {/*/!* Tarjeta de Resumen y Timeline de Marcaciones de Hoy *!/*/}
          {/*<Grid item xs={12} md={5} lg={5}>*/}
          {/*  <Card sx={{ height: "100%" }}>*/}
          {/*    <SoftBox p={3}>*/}
          {/*      <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>*/}
          {/*        <SoftTypography variant="h6" fontWeight="bold">*/}
          {/*          Marcaciones de Hoy*/}
          {/*        </SoftTypography>*/}

          {/*        <SoftBadge*/}
          {/*          variant="gradient"*/}
          {/*          color={*/}
          {/*            todayClocks.length % 2 !== 0*/}
          {/*              ? "success"*/}
          {/*              : todayClocks.length > 0*/}
          {/*              ? "secondary"*/}
          {/*              : "dark"*/}
          {/*          }*/}
          {/*          badgeContent={todayClocks.length % 2 !== 0 ? "En Jornada" : "Fuera"}*/}
          {/*          size="xs"*/}
          {/*          container*/}
          {/*        />*/}
          {/*      </SoftBox>*/}

          {/*      <Divider />*/}

          {/*      {todayClocks.length === 0 ? (*/}
          {/*        <SoftBox py={4} textAlign="center">*/}
          {/*          <Icon fontSize="large" color="disabled" sx={{ mb: 1 }}>*/}
          {/*            schedule*/}
          {/*          </Icon>*/}
          {/*          <SoftTypography variant="button" color="secondary" display="block">*/}
          {/*            No has registrado marcaciones el día de hoy.*/}
          {/*          </SoftTypography>*/}
          {/*        </SoftBox>*/}
          {/*      ) : (*/}
          {/*        <SoftBox display="flex" flexDirection="column" gap={2} pt={1}>*/}
          {/*          {todayClocks.map((clock, index) => {*/}
          {/*            const timestamp =*/}
          {/*              typeof clock === "string" ? clock : clock.timestamp || clock.workDate;*/}
          {/*            const typeLabel =*/}
          {/*              clock.action ||*/}
          {/*              (index === 0 ? "ENTRADA" : index === 3 ? "SALIDA" : "ALMUERZO");*/}

          {/*            return (*/}
          {/*              <SoftBox*/}
          {/*                key={clock.id || index}*/}
          {/*                display="flex"*/}
          {/*                alignItems="center"*/}
          {/*                justifyContent="space-between"*/}
          {/*                p={1.5}*/}
          {/*                borderRadius="md"*/}
          {/*                bgColor="grey-100"*/}
          {/*              >*/}
          {/*                <SoftBox display="flex" alignItems="center" gap={1.5}>*/}
          {/*                  <SoftBox*/}
          {/*                    display="flex"*/}
          {/*                    justifyContent="center"*/}
          {/*                    alignItems="center"*/}
          {/*                    width="36px"*/}
          {/*                    height="36px"*/}
          {/*                    borderRadius="section"*/}
          {/*                    bgColor="white"*/}
          {/*                    shadow="xs"*/}
          {/*                  >*/}
          {/*                    <Icon color="info" fontSize="small">*/}
          {/*                      access_time*/}
          {/*                    </Icon>*/}
          {/*                  </SoftBox>*/}
          {/*                  <SoftBox>*/}
          {/*                    <SoftTypography variant="button" fontWeight="bold" color="dark">*/}
          {/*                      {formatTimeString(timestamp)}*/}
          {/*                    </SoftTypography>*/}
          {/*                    <SoftTypography variant="caption" color="text" display="block">*/}
          {/*                      Marcación #{index + 1}*/}
          {/*                    </SoftTypography>*/}
          {/*                  </SoftBox>*/}
          {/*                </SoftBox>*/}

          {/*                <SoftBadge*/}
          {/*                  variant="contained"*/}
          {/*                  color="dark"*/}
          {/*                  badgeContent={typeLabel}*/}
          {/*                  size="xs"*/}
          {/*                />*/}
          {/*              </SoftBox>*/}
          {/*            );*/}
          {/*          })}*/}
          {/*        </SoftBox>*/}
          {/*      )}*/}
          {/*    </SoftBox>*/}
          {/*  </Card>*/}
          {/*</Grid>*/}
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default EmpleadoMarcacion;
