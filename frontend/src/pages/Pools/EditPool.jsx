import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { getPoolById, updatePool } from '../../api/poolsApi';

const EditPool = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pool, setPool] = useState(null);
    const [formData, setFormData] = useState({ 
        nombre: '', 
        direccion: '', 
        altura: '', 
        ancho: '', 
        ciudad: '', 
        municipio: '', 
        categoria: '', 
        profundidades: '', 
        forma: '', 
        uso: '' 
    });

    useEffect(() => {
        const fetchPool = async () => {
            const fetchedPool = await getPoolById(id);
            setPool(fetchedPool);
            setFormData({
                nombre: fetchedPool.nombre,
                direccion: fetchedPool.direccion,
                altura: fetchedPool.altura,
                ancho: fetchedPool.ancho,
                ciudad: fetchedPool.ciudad,
                municipio: fetchedPool.municipio,
                categoria: fetchedPool.categoria,
                profundidades: JSON.stringify(fetchedPool.profundidades),
                forma: fetchedPool.forma,
                uso: fetchedPool.uso
            });
        };
        fetchPool();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updatePool(id, formData);
        navigate('/pools');
    };

    if (!pool) return <Typography>Loading...</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Edit Pool</Typography>
            <form onSubmit={handleSubmit}>
                <TextField name="nombre" label="Nombre" value={formData.nombre} onChange={handleChange} fullWidth margin="normal" />
                <TextField name="direccion" label="Dirección" value={formData.direccion} onChange={handleChange} fullWidth margin="normal" />
                <TextField name="altura" label="Altura" value={formData.altura} onChange={handleChange} fullWidth margin="normal" />
                <TextField name="ancho" label="Ancho" value={formData.ancho} onChange={handleChange} fullWidth margin="normal" />
                <TextField name="ciudad" label="Ciudad" value={formData.ciudad} onChange={handleChange} fullWidth margin="normal" />
                <TextField name="municipio" label="Municipio" value={formData.municipio} onChange={handleChange} fullWidth margin="normal" />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Categoría</InputLabel>
                    <Select name="categoria" value={formData.categoria} onChange={handleChange}>
                        <MenuItem value="Niños">Niños</MenuItem>
                        <MenuItem value="Adultos">Adultos</MenuItem>
                    </Select>
                </FormControl>
                <TextField name="profundidades" label="Profundidades (comma separated)" value={formData.profundidades} onChange={handleChange} fullWidth margin="normal" />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Forma</InputLabel>
                    <Select name="forma" value={formData.forma} onChange={handleChange}>
                        <MenuItem value="Rectangular">Rectangular</MenuItem>
                        <MenuItem value="Circular">Circular</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Uso</InputLabel>
                    <Select name="uso" value={formData.uso} onChange={handleChange}>
                        <MenuItem value="Privada">Privada</MenuItem>
                        <MenuItem value="Publica">Pública</MenuItem>
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">Update Pool</Button>
            </form>
        </Container>
    );
};

export default EditPool;
