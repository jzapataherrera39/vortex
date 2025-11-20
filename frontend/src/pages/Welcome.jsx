import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import PoolIcon from '@mui/icons-material/Pool'; // Opcional si tienes iconos instalados

const Welcome = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Paper 
            elevation={3}
            sx={{
                p: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 2,
                backgroundColor: '#f5f5f5' // Un fondo gris muy suave
            }}
        >
            {/* Icono grande (si no tienes @mui/icons-material, borra esta línea) */}
            <PoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />

            <Typography variant="h2" component="h1" gutterBottom color="primary">
              Bienvenido a Vortex
            </Typography>
            
            <Typography variant="h5" color="text.secondary" paragraph sx={{ maxWidth: 600 }}>
              Sistema integral para la gestión y mantenimiento de piscinas.
              Controla bombas, profundidades y documentación técnica en un solo lugar.
            </Typography>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                component={Link} 
                to="/login"
              >
                Iniciar Sesión
              </Button>
              {/* Botón opcional si quisieras mostrar algo público */}
            </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Welcome;