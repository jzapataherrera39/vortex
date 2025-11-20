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
    const [fileNames, setFileNames] = useState({
        foto: '',
        hojaSeguridad: '',
        fichaTecnica: '',
    });
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        altura: '',
        ancho: '',
        departamento: '', 
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
            ciudad: '' 
        });
        
        setFilteredCities(deptoData ? deptoData.ciudades : []);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData({ ...formData, [name]: files[0] });
            setFileNames({ ...fileNames, [name]: files[0].name });
        } else {
            setFormData({ ...formData, [name]: null });
            setFileNames({ ...fileNames, [name]: '' });
        }
    };

    const handleBombaChange = (index, e) => {
        const newBombas = [...formData.bombas];
        newBombas[index][e.target.name] = e.target.value;
        setFormData({ ...formData, bombas: newBombas });
    };

    const handleBombaFileChange = (index, e) => {
        const { name, files } = e.target;
        const newBombas = [...formData.bombas];
        if (files && files[0]) {
            newBombas[index][name] = files[0];
            newBombas[index].fotoFileName = files[0].name; // Store file name for display
        } else {
            newBombas[index][name] = null;
            newBombas[index].fotoFileName = '';
        }
        setFormData({ ...formData, bombas: newBombas });
    };

    const addBomba = () => {
        setFormData({ ...formData, bombas: [...formData.bombas, { marca: '', referencia: '', potencia: '', material: '', seRepite: 'no', totalBombas: 1, foto: null, fotoFileName: '' }] });
    };

    const removeBomba = (index) => {
        const newBombas = [...formData.bombas];
        newBombas.splice(index, 1);
        setFormData({ ...formData, bombas: newBombas });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validaciones del cliente
        if (!formData.nombre.trim()) {
            setError('El nombre de la piscina es requerido');
            return;
        }
        if (!formData.direccion.trim()) {
            setError('La dirección es requerida');
            return;
        }
        if (!formData.altura || parseFloat(formData.altura) <= 0) {
            setError('La altura debe ser mayor a 0');
            return;
        }
        if (!formData.ancho || parseFloat(formData.ancho) <= 0) {
            setError('El ancho debe ser mayor a 0');
            return;
        }
        if (!formData.departamento) {
            setError('El departamento es requerido');
            return;
        }
        if (!formData.ciudad) {
            setError('La ciudad es requerida');
            return;
        }
        if (!formData.categoria) {
            setError('La categoría es requerida');
            return;
        }
        if (!formData.profundidades.trim()) {
            setError('Las profundidades son requeridas');
            return;
        }
        if (!formData.forma) {
            setError('La forma es requerida');
            return;
        }
        if (!formData.uso) {
            setError('El uso es requerido');
            return;
        }
        if (!formData.foto) {
            setError('La foto principal es requerida');
            return;
        }
        if (!formData.hojaSeguridad) {
            setError('La hoja de seguridad es requerida');
            return;
        }
        if (!formData.fichaTecnica) {
            setError('La ficha técnica es requerida');
            return;
        }
        if (formData.bombas.length === 0) {
            setError('Debe agregar al menos una bomba');
            return;
        }

        // Validar que todas las bombas tengan foto
        for (let i = 0; i < formData.bombas.length; i++) {
            const bomba = formData.bombas[i];
            if (!bomba.marca.trim()) {
                setError(`La bomba ${i + 1} debe tener una marca`);
                return;
            }
            if (!bomba.referencia.trim()) {
                setError(`La bomba ${i + 1} debe tener una referencia`);
                return;
            }
            if (!bomba.potencia.trim()) {
                setError(`La bomba ${i + 1} debe tener una potencia`);
                return;
            }
            if (!bomba.material) {
                setError(`La bomba ${i + 1} debe tener un material`);
                return;
            }
            if (!bomba.foto) {
                setError(`La bomba ${i + 1} debe tener una foto`);
                return;
            }
        }

        const data = new FormData();

        // Create a copy of formData to modify before sending
        const dataToSend = { ...formData };

        // 1. Rename 'departamento' to 'municipio' for the backend
        dataToSend.municipio = dataToSend.departamento;
        delete dataToSend.departamento;

        // 2. Convert 'profundidades' string to a JSON string array and validate ordering
        if (dataToSend.profundidades && typeof dataToSend.profundidades === 'string') {
            const profundidadesArray = dataToSend.profundidades
                .split(',')
                .map(p => parseFloat(p.trim()))
                .filter(p => !isNaN(p));
            
            if (profundidadesArray.length === 0) {
                setError('Las profundidades deben contener números válidos');
                return;
            }

            // Verify ascending order
            for (let i = 0; i < profundidadesArray.length - 1; i++) {
                if (profundidadesArray[i] >= profundidadesArray[i + 1]) {
                    setError('Las profundidades deben estar en orden ascendente');
                    return;
                }
            }

            dataToSend.profundidades = JSON.stringify(profundidadesArray);
        }

        // 3. Convert altura and ancho to numbers
        dataToSend.altura = parseFloat(dataToSend.altura);
        dataToSend.ancho = parseFloat(dataToSend.ancho);
        
        for (const key in dataToSend) {
            if (key === 'bombas') {
                dataToSend.bombas.forEach((bomba, index) => {
                    for (const bombaKey in bomba) {
                        if (bombaKey !== 'fotoFileName') { // Exclude display-only field
                            data.append(`bombas[${index}][${bombaKey}]`, bomba[bombaKey]);
                        }
                    }
                });
            } else if (dataToSend[key] || dataToSend[key] === 0) {
                data.append(key, dataToSend[key]);
            }
        }

        try {
            await createPool(data);
            navigate('/pools'); 
        } catch (err) {
            console.error('Failed to create pool:', err);
            
            let errorMessage = 'Error al crear la piscina. Verifique los datos.';
            
            // Try to get detailed error messages from backend
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                // Join all validation errors
                errorMessage = err.response.data.errors
                    .map((e) => e.msg || e.message || String(e))
                    .join('; ');
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
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
                
                <Box sx={{ mt: 2, mb: 1 }}>
                    <Button variant="outlined" component="label" fullWidth>
                        Subir Foto Principal (PNG/JPEG)
                        <input type="file" name="foto" hidden onChange={handleFileChange} accept="image/png, image/jpeg" />
                    </Button>
                    {fileNames.foto && <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>Archivo: {fileNames.foto}</Typography>}
                </Box>
                
                <Box sx={{ mb: 1 }}>
                    <Button variant="outlined" component="label" fullWidth>
                        Subir Hoja de Seguridad (PDF)
                        <input type="file" name="hojaSeguridad" hidden onChange={handleFileChange} accept="application/pdf" />
                    </Button>
                    {fileNames.hojaSeguridad && <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>Archivo: {fileNames.hojaSeguridad}</Typography>}
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Button variant="outlined" component="label" fullWidth>
                        Subir Ficha Técnica (PDF)
                        <input type="file" name="fichaTecnica" hidden onChange={handleFileChange} accept="application/pdf" />
                    </Button>
                    {fileNames.fichaTecnica && <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>Archivo: {fileNames.fichaTecnica}</Typography>}
                </Box>

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
                        <Box sx={{ mt: 1 }}>
                            <Button variant="outlined" component="label" fullWidth>
                            Subir Foto de Bomba
                            <input type="file" name="foto" hidden onChange={(e) => handleBombaFileChange(index, e)} accept="image/png, image/jpeg" />
                            </Button>
                            {bomba.fotoFileName && <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>Archivo: {bomba.fotoFileName}</Typography>}
                        </Box>
                    </Box>
                ))}
                <Button onClick={addBomba} startIcon={<AddCircleOutlineIcon />} sx={{ mt: 1, mb: 3 }}>Añadir Bomba</Button>

                <Button type="submit" variant="contained" color="primary" fullWidth size="large">Guardar Piscina</Button>
            </Box>
        </Container>
    );
};

export default CreatePool;