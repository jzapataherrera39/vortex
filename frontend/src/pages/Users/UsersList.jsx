import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Chip
} from '@mui/material';
import userStore from '../../store/userStore';

export default function UsersList() {
  const { users, fetchUsers, toggleUserState } = userStore();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleClick = (user) => {
    setUserToToggle(user);
    setOpenDialog(true);
  };

  const handleToggleConfirm = async () => {
    if (userToToggle) {
      const newState = userToToggle.state === 'activo' ? 'inactivo' : 'activo';
      // Llamamos a la función del store corregida
      await toggleUserState(userToToggle._id, newState);
      setOpenDialog(false);
      setUserToToggle(null);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUserToToggle(null);
  };

  return (
    <Paper sx={{ p: 3, margin: 'auto', maxWidth: 1200, mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" color="primary">
          Gestión de Usuarios
        </Typography>
        {/* EL BOTÓN QUE FALTABA */}
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/admin/users/create')}
        >
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
            {users && users.length > 0 ? (
                users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.nombre} {user.apellido}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.rol}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={user.state}
                    color={user.state === 'activo' ? 'success' : 'error'}
                    size="small"
                    variant="outlined"
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
                  <Button
                    variant="contained"
                    color={user.state === 'activo' ? 'error' : 'success'}
                    size="small"
                    onClick={() => handleToggleClick(user)}
                  >
                    {user.state === 'activo' ? 'Inactivar' : 'Activar'}
                  </Button>
                </TableCell>
              </TableRow>
            ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} align="center">No hay usuarios registrados</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Cambio de Estado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Deseas cambiar el estado de <strong>{userToToggle?.nombre}</strong> a {userToToggle?.state === 'activo' ? 'Inactivo' : 'Activo'}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleToggleConfirm} color="primary" autoFocus variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}