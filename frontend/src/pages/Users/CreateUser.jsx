import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, TextField, Button, Typography, Box, 
    FormControl, InputLabel, Select, MenuItem, Paper, Alert 
} from '@mui/material';
import userStore from '../../store/userStore';

const CreateUser = () => {
    const navigate = useNavigate();
    const { createUser } = userStore();
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        cedula: '',
        email: '',
        password: '',
        rol: 'USER'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validaciones simples
        if(!formData.nombre || !formData.cedula || !formData.email || !formData.password) {
            setError('Por favor complete los campos obligatorios');
            return;
        }

        const result = await createUser(formData);
        if (result) {
            navigate('/admin/users');
        } else {
            setError('Error al crear usuario. Verifique si el email ya existe.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>Crear Nuevo Usuario</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField fullWidth label="Nombre" name="nombre" margin="normal" onChange={handleChange} required />
                    <TextField fullWidth label="Apellido" name="apellido" margin="normal" onChange={handleChange} />
                    <TextField fullWidth label="Cédula" name="cedula" margin="normal" onChange={handleChange} required />
                    <TextField fullWidth label="Email" name="email" type="email" margin="normal" onChange={handleChange} required />
                    <TextField fullWidth label="Contraseña" name="password" type="password" margin="normal" onChange={handleChange} required />
                    
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Rol</InputLabel>
                        <Select name="rol" value={formData.rol} label="Rol" onChange={handleChange}>
                            <MenuItem value="USER">Usuario (Solo Ver)</MenuItem>
                            <MenuItem value="ADMIN">Administrador</MenuItem>
                        </Select>
                    </FormControl>

                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} size="large">
                        Guardar Usuario
                    </Button>
                    <Button onClick={() => navigate('/admin/users')} fullWidth sx={{ mt: 1 }}>
                        Cancelar
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateUser;