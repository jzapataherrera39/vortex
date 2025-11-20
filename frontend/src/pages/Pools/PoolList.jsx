import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Chip
} from '@mui/material';
import poolStore from '../../store/poolStore';
import useAuthStore from '../../store/authStore';

export default function PoolList() {
  // Traemos toggleStatus del store
  const { pools, fetchPools, deletePool, toggleStatus } = poolStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [poolToDelete, setPoolToDelete] = useState(null);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  // --- Manejo de Eliminar ---
  const handleDeleteClick = (id) => {
    setPoolToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (poolToDelete) {
      await deletePool(poolToDelete);
      setOpenDeleteDialog(false);
      setPoolToDelete(null);
    }
  };

  // --- Manejo de Inactivar/Activar ---
  const handleToggleStatus = async (id) => {
    await toggleStatus(id);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setPoolToDelete(null);
  };

  return (
    <Paper sx={{ p: 3, margin: 'auto', maxWidth: 1200, mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" color="primary">
          Panel de Piscinas
        </Typography>
        {user?.rol === 'ADMIN' && (
          <Button variant="contained" color="primary" onClick={() => navigate('/pools/create')}>
            Crear Nueva Piscina
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell align="right"><strong>Categoría</strong></TableCell>
              <TableCell align="right"><strong>Uso</strong></TableCell>
              <TableCell align="center"><strong>Estado</strong></TableCell>
              {user?.rol === 'ADMIN' && <TableCell align="center"><strong>Acciones</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {pools.map((pool) => (
              <TableRow key={pool._id}>
                <TableCell component="th" scope="row">{pool.nombre}</TableCell>
                <TableCell align="right">{pool.categoria}</TableCell>
                <TableCell align="right">{pool.uso}</TableCell>
                
                {/* Chip de Estado */}
                <TableCell align="center">
                    <Chip 
                        label={pool.estado || 'activo'} // Fallback si es undefined
                        color={pool.estado === 'inactivo' ? 'default' : 'success'}
                        size="small"
                        variant="outlined"
                    />
                </TableCell>

                {user?.rol === 'ADMIN' && (
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => navigate(`/pools/edit/${pool._id}`)}
                    >
                      Editar
                    </Button>

                    {/* Botón de Activar/Inactivar */}
                    <Button
                        variant="contained"
                        color={pool.estado === 'inactivo' ? 'success' : 'warning'}
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleToggleStatus(pool._id)}
                    >
                        {pool.estado === 'inactivo' ? 'Activar' : 'Inactivar'}
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteClick(pool._id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar esta piscina permanentemente? Esta acción borrará todos los datos y archivos asociados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus variant="contained">
            Eliminar Definitivamente
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}