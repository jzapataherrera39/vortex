import React from 'react';
import LoginForm from '../components/LoginForm'; // Asegúrate de que este componente exista
import { Box, Paper, Typography, Avatar, Grid } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LoginPage = () => {
  return (
    <Grid 
      container 
      component="main" 
      sx={{ 
        height: '100vh', // Ocupa toda la altura de la pantalla
        backgroundImage: 'linear-gradient(135deg, #004e92 0%, #000428 100%)', // Gradiente Azul Profundo
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Grid item xs={12} sm={8} md={5} lg={4}>
        <Paper
          elevation={10} // Sombra fuerte para destacar sobre el azul
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3, // Bordes redondeados modernos
            backgroundColor: 'rgba(255, 255, 255, 0.95)', // Blanco ligeramente translúcido (opcional)
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
            Bienvenido
          </Typography>

          <Box sx={{ width: '100%' }}>
            {/* Aquí cargamos tu formulario funcional */}
            <LoginForm />
          </Box>
          
          {/* Footer opcional dentro de la tarjeta */}
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            © {new Date().getFullYear()} Vortex App
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;