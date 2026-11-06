import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftAlert from "components/SoftAlert";

// Soft UI Dashboard React layout & examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// API Services
import { getAllUsers } from "api/userService";
import { getMonthlyAttendanceHistory, uploadAttendanceExcel } from "api/attendanceService";

// Data Table Mapper
import empleadosTableData from "layouts/empleados/data/empleadosTableData";
import attendanceTableData from "layouts/profile/data/attendanceTableData";

function Empleados() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Estados de Paginación de la tabla principal
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estados para Modal de Historial de Marcaciones
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAttendance, setUserAttendance] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const now = new Date();
  const defaultPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod);

  // Estados para Modal de Carga de Excel
  const [excelUser, setExcelUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Cargar lista de empleados
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setAlert({ type: "error", text: "Error al cargar la lista de empleados." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Cargar historial del empleado seleccionado
  const fetchUserHistory = async (userId, periodStr) => {
    const [year, month] = periodStr.split("-");
    setLoadingHistory(true);
    try {
      const data = await getMonthlyAttendanceHistory(userId, parseInt(year, 10), parseInt(month, 10));
      setUserAttendance(Array.isArray(data) ? data : []);
    } catch (err) {
      setAlert({ type: "error", text: "Error al obtener las marcaciones del empleado." });
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleOpenUserHistory = (user) => {
    setSelectedUser(user);
    fetchUserHistory(user.id, selectedPeriod);
  };

  const handlePeriodChange = (e) => {
    const newPeriod = e.target.value;
    setSelectedPeriod(newPeriod);
    if (selectedUser) {
      fetchUserHistory(selectedUser.id, newPeriod);
    }
  };

  // Enviar Excel al Backend
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !excelUser) return;

    const [yearStr, monthStr] = selectedPeriod.split("-");
    setUploading(true);

    try {
      await uploadAttendanceExcel(selectedFile, excelUser.id, parseInt(yearStr, 10), parseInt(monthStr, 10));
      setAlert({ type: "success", text: `Archivo Excel importado con éxito para ${excelUser.username || excelUser.email}` });
      setExcelUser(null);
      setSelectedFile(null);
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Error al subir el archivo Excel." });
    } finally {
      setUploading(false);
    }
  };

  // Lógica de Paginación para la tabla de empleados
  const { columns, rows } = empleadosTableData(users, handleOpenUserHistory, (user) => setExcelUser(user));
  const totalEntries = rows.length;
  const pageCount = Math.ceil(totalEntries / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRows = rows.slice(indexOfFirstItem, indexOfLastItem);

  // Sub-tabla de Marcaciones
  const { columns: historyCols, rows: historyRows } = attendanceTableData(userAttendance);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        {alert && (
          <SoftBox mb={3}>
            <SoftAlert color={alert.type} dismissible onClose={() => setAlert(null)}>
              {alert.text}
            </SoftAlert>
          </SoftBox>
        )}

        {/* Tabla Principal de Empleados */}
        <Card>
          <SoftBox
            pt={3}
            px={3}
            pb={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <SoftTypography variant="h6" fontWeight="medium">
              Gestión de Empleados y Asistencias
            </SoftTypography>
            <SoftTypography variant="button" color="secondary">
              Total: {totalEntries} empleados
            </SoftTypography>
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
                  Cargando directorio de empleados...
                </SoftTypography>
              </SoftBox>
            ) : rows.length === 0 ? (
              <SoftBox p={3} textAlign="center">
                <SoftTypography variant="button" color="text">
                  No se encontraron empleados registrados.
                </SoftTypography>
              </SoftBox>
            ) : (
              <>
                <Table columns={columns} rows={currentRows} />

                <SoftBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={3}
                  flexWrap="wrap"
                  gap={2}
                >
                  <SoftTypography variant="button" color="secondary">
                    Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, totalEntries)} de{" "}
                    {totalEntries} registros
                  </SoftTypography>
                  <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={(e, val) => setCurrentPage(val)}
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

      {/* Modal 1: Historial de Marcaciones del Empleado Seleccionado */}
      <Dialog
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <SoftTypography variant="h6">
            Historial de Marcaciones - {selectedUser?.username || selectedUser?.email}
          </SoftTypography>
          <TextField
            type="month"
            size="small"
            value={selectedPeriod}
            onChange={handlePeriodChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogTitle>
        <DialogContent dividers>
          <SoftBox sx={{ overflowX: "auto" }}>
            {loadingHistory ? (
              <SoftTypography variant="button" color="text">
                Cargando marcaciones...
              </SoftTypography>
            ) : historyRows.length === 0 ? (
              <SoftTypography variant="button" color="secondary">
                No hay marcaciones para este período.
              </SoftTypography>
            ) : (
              <Table columns={historyCols} rows={historyRows} />
            )}
          </SoftBox>
        </DialogContent>
        <DialogActions>
          <SoftButton color="secondary" onClick={() => setSelectedUser(null)}>
            Cerrar
          </SoftButton>
        </DialogActions>
      </Dialog>

      {/* Modal 2: Carga Masiva vía Excel */}
      <Dialog open={Boolean(excelUser)} onClose={() => setExcelUser(null)} maxWidth="xs" fullWidth>
        <form onSubmit={handleUploadSubmit}>
          <DialogTitle>
            <SoftTypography variant="h6">Cargar Marcaciones Excel</SoftTypography>
            <SoftTypography variant="caption" color="text">
              Empleado: {excelUser?.username || excelUser?.email}
            </SoftTypography>
          </DialogTitle>
          <DialogContent dividers display="flex" flexDirection="column" gap={2}>
            <SoftBox mb={2}>
              <TextField
                type="month"
                size="small"
                fullWidth
                label="Período del Excel"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </SoftBox>
            <SoftBox>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ width: "100%" }}
                required
              />
            </SoftBox>
          </DialogContent>
          <DialogActions>
            <SoftButton color="secondary" onClick={() => setExcelUser(null)}>
              Cancelar
            </SoftButton>
            <SoftButton type="submit" variant="gradient" color="success" disabled={uploading}>
              {uploading ? "Subiendo..." : "Subir Archivo"}
            </SoftButton>
          </DialogActions>
        </form>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default Empleados;