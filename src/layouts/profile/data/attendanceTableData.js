// src/layouts/profile/data/attendanceTableData.js

// Soft UI Dashboard React components
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

// Función auxiliar para extraer solo la hora HH:mm en formato legible
const formatTime = (isoString) => {
  if (!isoString) return "--:--";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function attendanceTableData(attendanceList = []) {
  return {
    columns: [
      { name: "fecha", align: "left" },
      { name: "entrada", align: "center" },
      { name: "salidaAlmuerzo", align: "center" },
      { name: "regresoAlmuerzo", align: "center" },
      { name: "salida", align: "center" },
      { name: "estado", align: "center" },
    ],

    rows: attendanceList.map((item) => {
      const isComplete = Boolean(item.clockIn && item.clockOut);
      const statusLabel = isComplete ? "Completado" : "En Jornada";

      return {
        fecha: (
          <SoftTypography variant="button" fontWeight="medium" color="text">
            {item.workDate || "--/--/----"}
          </SoftTypography>
        ),
        entrada: (
          <SoftTypography variant="button" fontWeight="bold" color="dark">
            {formatTime(item.clockIn)}
          </SoftTypography>
        ),
        salidaAlmuerzo: (
          <SoftTypography variant="caption" color="secondary" fontWeight="medium">
            {formatTime(item.lunchOut)}
          </SoftTypography>
        ),
        regresoAlmuerzo: (
          <SoftTypography variant="caption" color="secondary" fontWeight="medium">
            {formatTime(item.lunchIn)}
          </SoftTypography>
        ),
        salida: (
          <SoftTypography variant="button" fontWeight="bold" color="dark">
            {formatTime(item.clockOut)}
          </SoftTypography>
        ),
        estado: (
          <SoftBadge
            variant="gradient"
            badgeContent={statusLabel}
            color={isComplete ? "success" : "info"}
            size="xs"
            container
          />
        ),
      };
    }),
  };
}
