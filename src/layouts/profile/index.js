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

/**
 =========================================================
 - Soft UI Dashboard React - v4.0.1
 =========================================================
 */

import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import Table from "examples/Tables/Table";

// Overview page components
import Header from "layouts/profile/components/Header";

// Data & Service API
import attendanceTableData from "layouts/profile/data/attendanceTableData";
import { getMonthlyAttendanceHistory } from "api/attendanceService";

function Overview() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para Filtro de Mes/Año
  const now = new Date();
  const defaultYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [selectedPeriod, setSelectedPeriod] = useState(defaultYearMonth);

  // Estados para Paginación manual
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Registros por página

  // Datos de sesión
  const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  const username = localStorage.getItem("username") || sessionStorage.getItem("username") || "Empleado";
  const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole") || "ROLE_EMPLOYEE";

  const fetchAttendance = async (periodString) => {
    if (!userId || !periodString) return;

    const [yearStr, monthStr] = periodString.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    setLoading(true);
    try {
      const data = await getMonthlyAttendanceHistory(userId, year, month);
      setAttendanceRecords(Array.isArray(data) ? data : []);
      setCurrentPage(1); // Reiniciar a la página 1 al filtrar
    } catch (error) {
      console.error("Error al obtener el historial de marcaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRole = (role) => {
    if (role === "ROLE_EMPLOYEE") return "Empleado";
    if (role === "ROLE_ADMIN") return "Administrador";
    return role ? role.replace("ROLE_", "") : "Empleado";
  };

  useEffect(() => {
    fetchAttendance(selectedPeriod);
  }, [userId]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAttendance(selectedPeriod);
  };

  // 1. Obtener todas las columnas y filas
  const { columns, rows } = attendanceTableData(attendanceRecords);

  // 2. Lógica de Paginación en JS
  const totalEntries = rows.length;
  const pageCount = Math.ceil(totalEntries / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Cortar array de filas para renderizar solo los 10 registros de la página activa
  const currentRows = rows.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <DashboardLayout>
      <Header />

      {/* Información del Perfil */}
      {/*<SoftBox mt={5} mb={3}>*/}
      {/*  <Grid container spacing={3}>*/}
      {/*    <Grid item xs={12} md={8} xl={6}>*/}
      {/*      <ProfileInfoCard*/}
      {/*        title="Información del Perfil"*/}
      {/*        description="Resumen de datos del empleado y rol asignado para la marcación de asistencia."*/}
      {/*        info={{*/}
      {/*          fullName: username,*/}
      {/*          role: formatRole(userRole),*/}
      {/*          // userId: userId || "N/A",*/}
      {/*          estado: "Activo",*/}
      {/*        }}*/}
      {/*        social={[]}*/}
      {/*        action={{ route: "", tooltip: "Editar Perfil" }}*/}
      {/*      />*/}
      {/*    </Grid>*/}
      {/*  </Grid>*/}
      {/*</SoftBox>*/}

      {/* Historial con Tabla y Paginación Custom */}
      <SoftBox mb={3}>
        <Card>
          <SoftBox
            pt={3}
            px={3}
            pb={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <SoftTypography variant="h6" fontWeight="medium">
              Historial de Marcaciones
            </SoftTypography>

            <SoftBox
              component="form"
              onSubmit={handleFilterSubmit}
              display="flex"
              gap={2}
              alignItems="center"
            >
              <TextField
                type="month"
                size="small"
                label="Seleccionar Período"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180 }}
              />

              <SoftButton type="submit" variant="gradient" color="info" size="small">
                Filtrar
              </SoftButton>
            </SoftBox>
          </SoftBox>

          <SoftBox
            sx={{
              overflowX: "auto",
              display: "block",
              width: "100%",
              "& .MuiTableRow-root:not(:last-child)": {
                "& td": {
                  borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                    `${borderWidth[1]} solid ${borderColor}`,
                },
              },
            }}
          >
            {loading ? (
              <SoftBox p={3} textAlign="center">
                <SoftTypography variant="button" color="text">
                  Cargando marcaciones...
                </SoftTypography>
              </SoftBox>
            ) : rows.length === 0 ? (
              <SoftBox p={3} textAlign="center">
                <SoftTypography variant="button" color="text">
                  No se encontraron marcaciones para el período seleccionado.
                </SoftTypography>
              </SoftBox>
            ) : (
              <>
                {/* Renderizar solo las filas recortadas de la página actual */}
                <Table columns={columns} rows={currentRows} />

                {/* Footer de Paginación ("Showing 1 to 10 of X entries") */}
                <SoftBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={3}
                  flexWrap="wrap"
                  gap={2}
                >
                  <SoftTypography variant="button" color="secondary" fontWeight="regular">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalEntries)} of{" "}
                    {totalEntries} entries
                  </SoftTypography>

                  <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="info"
                    shape="circular"
                    size="small"
                  />
                </SoftBox>
              </>
            )}
          </SoftBox>
        </Card>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Overview;