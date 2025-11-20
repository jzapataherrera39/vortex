import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Select, MenuItem, InputLabel, FormControl, Box, IconButton, Alert } from '@mui/material';
import { createPool } from '../../api/poolsApi';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { colombiaData } from '../../data/colombia.js';

const CreatePool = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        altura: '',
        ancho: '',
        departamento: '', // Renamed from municipio
        ciudad: '',
        categoria: '',
        profundidades: '',
        forma: '',
        uso: '',
        foto: null,
        hojaSeguridad: null,
        fichaTecnica: null,
        bombas: [],
    });

    const handleDepartamentoChange = (e) => {
        const selectedDepartamento = e.target.value;
        const deptoData = colombiaData.find(d => d.departamento === selectedDepartamento);
        
        setFormData({
            ...formData,
            departamento: selectedDepartamento,
            ciudad: '' // Reset city on department change
        });
        
        setFilteredCities(deptoData ? deptoData.ciudades : []);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handleBombaChange = (index, e) => {
        const newBombas = [...formData.bombas];
        newBombas[index][e.target.name] = e.target.value;
        setFormData({ ...formData, bombas: newBombas });
    };

    const handleBombaFileChange = (index, e) => {
        const newBombas = [...formData.bombas];
        newBombas[index][e.target.name] = e.target.files[0];
        setFormData({ ...formData, bombas: newBombas });
    };

    const addBomba = () => {
        setFormData({ ...formData, bombas: [...formData.bombas, { marca: '', referencia: '', potencia: '', material: '', seRepite: 'no', totalBombas: 1, foto: null }] });
    };

    const removeBomba = (index) => {
        const newBombas = [...formData.bombas];
        newBombas.splice(index, 1);
        setFormData({ ...formData, bombas: newBombas });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const data = new FormData();
        // Append all fields to FormData
        for (const key in formData) {
            if (key === 'bombas') {
                formData.bombas.forEach((bomba, index) => {
                    for (const bombaKey in bomba) {
                        data.append(`bombas[${index}][${bombaKey}]`, bomba[bombaKey]);
                    }
                });
            } else if (formData[key]) { // Only append if value is not null/empty
                data.append(key, formData[key]);
            }
        }

        try {
            await createPool(data);
            navigate('/pools'); // Redirect on success
        } catch (err) {
            console.error('Failed to create pool:', err);
            setError(err.response?.data?.message || 'Error al crear la piscina. Verifique los datos.');
        }
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Crear Nueva Piscina</Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField name="nombre" label="Nombre" onChange={handleChange} fullWidth margin="normal" required />
                <TextField name="direccion" label="Dirección" onChange={handleChange} fullWidth margin="normal" required />
                <TextField name="altura" label="Altura (metros)" onChange={handleChange} fullWidth margin="normal" required />
                <TextField name="ancho" label="Ancho (metros)" onChange={handleChange} fullWidth margin="normal" required />

                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Departamento</InputLabel>
                    <Select name="departamento" value={formData.departamento} label="Departamento" onChange={handleDepartamentoChange}>
                        {colombiaData.map((depto) => (
                            <MenuItem key={depto.departamento} value={depto.departamento}>
                                {depto.departamento}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" required disabled={!formData.departamento}>
                    <InputLabel>Ciudad</InputLabel>
                    <Select name="ciudad" value={formData.ciudad} label="Ciudad" onChange={handleChange}>
                        {filteredCities.map((city) => (
                            <MenuItem key={city} value={city}>
                                {city}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Categoría</InputLabel>
                    <Select name="categoria" value={formData.categoria} label="Categoría" onChange={handleChange}>
                        <MenuItem value="Niños">Niños</MenuItem>
                        <MenuItem value="Adultos">Adultos</MenuItem>
                    </Select>
                </FormControl>
                <TextField name="profundidades" label="Profundidades (separadas por coma, en orden asc.)" onChange={handleChange} fullWidth margin="normal" required />
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Forma</InputLabel>
                    <Select name="forma" value={formData.forma} label="Forma" onChange={handleChange}>
                        <MenuItem value="Rectangular">Rectangular</MenuItem>
                        <MenuItem value="Circular">Circular</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Uso</InputLabel>
                    <Select name="uso" value={formData.uso} label="Uso" onChange={handleChange}>
                        <MenuItem value="Privada">Privada</MenuItem>
                        <MenuItem value="Publica">Pública</MenuItem>
                    </Select>
                </FormControl>
                
                <Button variant="outlined" component="label" fullWidth sx={{ mt: 2, mb: 1 }}>
                    Subir Foto Principal (PNG/JPEG)
                    <input type="file" name="foto" hidden onChange={handleFileChange} accept="image/png, image/jpeg" />
                </Button>
                <Button variant="outlined" component="label" fullWidth sx={{ mb: 1 }}>
                    Subir Hoja de Seguridad (PDF)
                    <input type="file" name="hojaSeguridad" hidden onChange={handleFileChange} accept="application/pdf" />
                </Button>
                <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
                    Subir Ficha Técnica (PDF)
                    <input type="file" name="fichaTecnica" hidden onChange={handleFileChange} accept="application/pdf" />
                </Button>

                <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Bombas</Typography>
                {formData.bombas.map((bomba, index) => (
                    <Box key={index} sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, mb: 2, position: 'relative' }}>
                        <IconButton onClick={() => removeBomba(index)} sx={{ position: 'absolute', top: 8, right: 8 }}><DeleteIcon /></IconButton>
                        <TextField name="marca" label="Marca" value={bomba.marca} onChange={(e) => handleBombaChange(index, e)} fullWidth margin="normal" />
                        <TextField name="referencia" label="Referencia" value={bomba.referencia} onChange={(e) => handleBombaChange(index, e)} fullWidth margin="normal" />
                        <TextField name="potencia" label="Potencia" value={bomba.potencia} onChange={(e) => handleBombaChange(index, e)} fullWidth margin="normal" />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Material</InputLabel>
                            <Select name="material" value={bomba.material} label="Material" onChange={(e) => handleBombaChange(index, e)}>
                                <MenuItem value="Sumergible">Sumergible</MenuItem>
                                <MenuItem value="Centrifuga">Centrifuga</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>¿Se Repite?</InputLabel>
                            <Select name="seRepite" value={bomba.seRepite} label="¿Se Repite?" onChange={(e) => handleBombaChange(index, e)}>
                                <MenuItem value="si">Si</MenuItem>
                                <MenuItem value="no">No</MenuItem>
                            </Select>
                        </FormControl>
                        {bomba.seRepite === 'si' && (
                            <TextField name="totalBombas" label="Total Bombas" type="number" value={bomba.totalBombas} onChange={(e) => handleBombaChange(index, e)} fullWidth margin="normal" />
                        )}
                        <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>
                           Subir Foto de Bomba
                           <input type="file" name="foto" hidden onChange={(e) => handleBombaFileChange(index, e)} accept="image/png, image/jpeg" />
                        </Button>
                    </Box>
                ))}
                <Button onClick={addBomba} startIcon={<AddCircleOutlineIcon />} sx={{ mt: 1, mb: 3 }}>Añadir Bomba</Button>

                <Button type="submit" variant="contained" color="primary" fullWidth size="large">Guardar Piscina</Button>
            </Box>
        </Container>
    );
};

export default CreatePool;