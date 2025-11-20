import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import useAuthStore from './store/authStore';

function App() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
          >
            Piscinas App
          </Typography>

          {user ? (
            <>
              <Button color="inherit" component={Link} to="/piscinas">
                Piscinas
              </Button>

              {user.rol === 'ADMIN' && (
                <Button color="inherit" component={Link} to="/admin/users">
                  Usuarios
                </Button>
              )}

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <AppRouter />
      </Container>
    </>
  );
}

export default App;
