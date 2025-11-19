import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { getUserById, updateUser } from '../../api/usersApi';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', apellido: '', cedula: '', email: '', rol: '', state: '' });

    useEffect(() => {
        const fetchUser = async () => {
            const fetchedUser = await getUserById(id);
            setUser(fetchedUser);
            setFormData({ 
                nombre: fetchedUser.nombre,
                apellido: fetchedUser.apellido,
                cedula: fetchedUser.cedula,
                email: fetchedUser.email,
                rol: fetchedUser.rol,
                state: fetchedUser.state
            });
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateUser(id, formData);
        navigate('/admin/users');
    };

    if (!user) return <Typography>Loading...</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Edit User</Typography>
            <form onSubmit={handleSubmit}>
                <TextField name="nombre" label="Nombre" value={formData.nombre} onChange={handleChange} fullWidth margin="normal" />
                <TextField name="apellido" label="Apellido" value={formData.apellido} onChange={handleChange} fullWidth margin="normal" />
                <TextField name="cedula" label="Cédula" value={formData.cedula} onChange={handleChange} fullWidth margin="normal" />
                <TextField name="email" label="Email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Rol</InputLabel>
                    <Select name="rol" value={formData.rol} onChange={handleChange}>
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                        <MenuItem value="USER">USER</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Estado</InputLabel>
                    <Select name="state" value={formData.state} onChange={handleChange}>
                        <MenuItem value="activo">Activo</MenuItem>
                        <MenuItem value="inactivo">Inactivo</MenuItem>
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">Update User</Button>
            </form>
        </Container>
    );
};

export default EditUser;
