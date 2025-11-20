import React from 'react';
import LoginForm from '../components/LoginForm';
import { Container, Box, Typography } from '@mui/material';

const LoginPage = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <Box sx={{ mt: 1 }}>
          <LoginForm />
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
