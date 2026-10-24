import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box, Alert, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { AccessTime as AccessTimeIcon, CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';
import { getUsers, registerClock, getTodayAttendance } from '../api/attendanceService';

export default function ClockInCard() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const loadTodayAttendance = async (userId) => {
        if (!userId) {
            setAttendance(null);
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        try {
            const data = await getTodayAttendance(userId, today);
            setAttendance(data);
            setError('');
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setAttendance(null);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            try {
                const data = await getUsers();
                if (isMounted) {
                    const safeUsers = Array.isArray(data) ? data : [];
                    setUsers(safeUsers);
                    if (safeUsers.length > 0) {
                        const firstUserId = safeUsers[0].id;
                        setSelectedUserId(firstUserId);
                        loadTodayAttendance(firstUserId);
                    }
                }
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                if (isMounted) {
                    setUsers([]);
                    setError('Error al conectar con el backend o cargar los usuarios.');
                }
            }
        };

        loadInitialData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleUserChange = (event) => {
        const userId = event.target.value;
        setSelectedUserId(userId);
        loadTodayAttendance(userId);
    };

    const handleClock = async () => {
        if (!selectedUserId) return;
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const updatedEntry = await registerClock(selectedUserId);
            setAttendance(updatedEntry);
            setMessage('Marcación registrada con éxito.');
        } catch (err) {
            setError(err.message || 'Error al registrar marcación.');
        } finally {
            setLoading(false);
        }
    };

    const getNextActionText = () => {
        if (!attendance) return 'Registrar Entrada';
        if (!attendance.clockIn) return 'Registrar Entrada';
        if (!attendance.lunchOut) return 'Salida a Almuerzo';
        if (!attendance.lunchIn) return 'Entrada de Almuerzo';
        if (!attendance.clockOut) return 'Registrar Salida';
        return 'Jornada Completada';
    };

    const isCompleted = attendance?.clockIn && attendance?.lunchOut && attendance?.lunchIn && attendance?.clockOut;

    return (
        <Card sx={{ maxWidth: 450, margin: '2rem auto', p: 2, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" component="div" align="center" gutterBottom>
                    Control de Asistencia
                </Typography>

                <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel id="user-select-label">Empleado</InputLabel>
                    <Select
                        labelId="user-select-label"
                        value={selectedUserId}
                        label="Empleado"
                        onChange={handleUserChange}
                    >
                        {(users || []).map((u) => (
                            <MenuItem key={u.id} value={u.id}>
                                {u.firstName} {u.lastName} (${u.baseSalary})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

                <Box sx={{ my: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">Entrada: <b>{attendance?.clockIn ? new Date(attendance.clockIn).toLocaleTimeString() : '--:--'}</b></Typography>
                    <Typography variant="body2" color="text.secondary">Salida Almuerzo: <b>{attendance?.lunchOut ? new Date(attendance.lunchOut).toLocaleTimeString() : '--:--'}</b></Typography>
                    <Typography variant="body2" color="text.secondary">Entrada Almuerzo: <b>{attendance?.lunchIn ? new Date(attendance.lunchIn).toLocaleTimeString() : '--:--'}</b></Typography>
                    <Typography variant="body2" color="text.secondary">Salida: <b>{attendance?.clockOut ? new Date(attendance.clockOut).toLocaleTimeString() : '--:--'}</b></Typography>
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    color={isCompleted ? "success" : "primary"}
                    startIcon={isCompleted ? <CheckCircleOutlineIcon /> : <AccessTimeIcon />}
                    onClick={handleClock}
                    disabled={loading || !selectedUserId || isCompleted}
                    sx={{ mt: 1 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : getNextActionText()}
                </Button>
            </CardContent>
        </Card>
    );
}