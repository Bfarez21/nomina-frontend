// src/layouts/empleados/data/empleadosTableData.js

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";
import SoftButton from "components/SoftButton";
import Icon from "@mui/material/Icon";

export default function empleadosTableData(users = [], onSelectEmployee, onUploadExcel) {
  const formatRole = (role) => {
    if (role === "ROLE_EMPLOYEE") return "Empleado";
    if (role === "ROLE_ADMIN") return "Administrador";
    return role ? role.replace("ROLE_", "") : "Empleado";
  };

  return {
    columns: [
      { name: "id", align: "center" },
      { name: "empleado", align: "left" },
      { name: "rol", align: "center" },
      { name: "estado", align: "center" },
      { name: "acciones", align: "center" },
    ],

    rows: users.map((user) => {
      const isUserActive = user.active !== false;

      return {
        id: (
          <SoftTypography variant="button" fontWeight="bold" color="text">
            #{user.id}
          </SoftTypography>
        ),
        empleado: (
          <SoftBox display="flex" flexDirection="column">
            <SoftTypography variant="button" fontWeight="medium" color="dark">
              {user.username || user.name || user.email}
            </SoftTypography>
            <SoftTypography variant="caption" color="secondary">
              {user.email}
            </SoftTypography>
          </SoftBox>
        ),
        rol: (
          <SoftBadge
            variant="gradient"
            badgeContent={formatRole(user.role || user.userRole)}
            color={user.role === "ROLE_ADMIN" ? "primary" : "info"}
            size="xs"
            container
          />
        ),
        estado: (
          <SoftBadge
            variant="badge"
            badgeContent={isUserActive ? "Activo" : "Inactivo"}
            color={isUserActive ? "success" : "secondary"}
            size="xs"
            container
          />
        ),
        acciones: (
          <SoftBox display="flex" gap={1} justifyContent="center">
            {/* Botón Ver Historial */}
            <SoftButton
              variant="outlined"
              color="info"
              size="xs"
              onClick={() => onSelectEmployee(user)}
            >
              <Icon sx={{ mr: 0.5 }}>visibility</Icon> Marcaciones
            </SoftButton>

            {/* Botón Subir Excel de Asistencia */}
            <SoftButton
              variant="outlined"
              color="success"
              size="xs"
              onClick={() => onUploadExcel(user)}
            >
              <Icon sx={{ mr: 0.5 }}>upload_file</Icon> Cargar Excel
            </SoftButton>
          </SoftBox>
        ),
      };
    }),
  };
}
