import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Chip, Snackbar, Alert, CircularProgress
} from '@mui/material';
import userStore from '../../store/userStore';

export default function UsersList() {
  // Traemos deleteUser del store
  const { users, fetchUsers, toggleUserState, deleteUser } = userStore();
  const navigate = useNavigate();
  
  // Estados para diálogos
  const [openToggleDialog, setOpenToggleDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Nuevo estado para eliminar
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Lógica de Inactivar/Activar ---
  const handleToggleClick = (user) => {
    setSelectedUser(user);
    setOpenToggleDialog(true);
  };

  const handleToggleConfirm = async () => {
    if (selectedUser) {
      setLoadingAction(true);
      const newState = selectedUser.state === 'activo' ? 'inactivo' : 'activo';
      const success = await toggleUserState(selectedUser._id, newState);
      handleActionResult(success, `Usuario ${newState === 'activo' ? 'activado' : 'inactivado'} correctamente.`);
      setOpenToggleDialog(false);
    }
  };

  // --- Lógica de Eliminar (NUEVA) ---
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      setLoadingAction(true);
      const success = await deleteUser(selectedUser._id); // Llamada al store
      handleActionResult(success, 'Usuario eliminado permanentemente.');
      setOpenDeleteDialog(false);
    }
  };

  // Helper para manejar resultados
  const handleActionResult = (success, successMsg) => {
    setLoadingAction(false);
    setSelectedUser(null);
    if (success) {
      setSnackbar({ open: true, message: successMsg, severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'Ocurrió un error al procesar la solicitud.', severity: 'error' });
    }
  };

  const handleCloseDialogs = () => {
    if (!loadingAction) {
        setOpenToggleDialog(false);
        setOpenDeleteDialog(false);
        setSelectedUser(null);
    }
  };

  return (
    <Paper sx={{ p: 3, margin: 'auto', maxWidth: 1200, mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" color="primary">
          Gestión de Usuarios
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/admin/users/create')}>
          + Crear Usuario
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Rol</strong></TableCell>
              <TableCell align="center"><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.nombre} {user.apellido}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.rol}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={user.state}
                    color={user.state === 'activo' ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                  >
                    Editar
                  </Button>
                  
                  {/* Botón Inactivar/Activar */}
                  <Button
                    variant="contained"
                    color={user.state === 'activo' ? 'warning' : 'success'}
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleToggleClick(user)}
                  >
                    {user.state === 'activo' ? 'Inactivar' : 'Activar'}
                  </Button>

                  {/* NUEVO BOTÓN ELIMINAR */}
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(user)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo Confirmar Cambio de Estado */}
      <Dialog open={openToggleDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Confirmar Cambio de Estado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Cambiar estado de <strong>{selectedUser?.nombre}</strong> a {selectedUser?.state === 'activo' ? 'Inactivo' : 'Activo'}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} disabled={loadingAction}>Cancelar</Button>
          <Button onClick={handleToggleConfirm} color="primary" variant="contained" disabled={loadingAction}>
            {loadingAction ? <CircularProgress size={20} /> : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* NUEVO Diálogo Confirmar Eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialogs}>
        <DialogTitle>¿Eliminar Usuario Definitivamente?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estás a punto de eliminar a <strong>{selectedUser?.nombre}</strong>. 
            Esta acción <strong>no se puede deshacer</strong> y borrará sus datos permanentemente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} disabled={loadingAction}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus disabled={loadingAction}>
            {loadingAction ? <CircularProgress size={20} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}