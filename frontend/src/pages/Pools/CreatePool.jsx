import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Select, MenuItem, InputLabel, FormControl, Box, IconButton, Alert } from '@mui/material';
import { createPool } from '../../api/poolsApi';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import the check icon
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
        municipio: '', 
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

    const handleMunicipioChange = (e) => {
        const selectedMunicipio = e.target.value;
        const deptoData = colombiaData.find(d => d.departamento === selectedMunicipio);
        
        setFormData({
            ...formData,
            municipio: selectedMunicipio,
            ciudad: '' 
        });
        
        setFilteredCities(deptoData ? deptoData.ciudades : []);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] || null });
    };

    const handleBombaChange = (index, e) => {
        const newBombas = [...formData.bombas];
        newBombas[index][e.target.name] = e.target.value;
        setFormData({ ...formData, bombas: newBombas });
    };

    const handleBombaFileChange = (index, e) => {
        const { name, files } = e.target;
        const newBombas = [...formData.bombas];
        newBombas[index][name] = files[0] || null;
        setFormData({ ...formData, bombas: newBombas });
    };

    const addBomba = () => {
        setFormData({ 
            ...formData, 
            bombas: [...formData.bombas, { marca: '', referencia: '', potencia: '', material: '', seRepite: 'no', totalBombas: 1, foto: null }] 
        });
    };

    const removeBomba = (index) => {
        const newBombas = formData.bombas.filter((_, i) => i !== index);
        setFormData({ ...formData, bombas: newBombas });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

   
        for (const field of ['nombre', 'direccion', 'altura', 'ancho', 'municipio', 'ciudad', 'categoria', 'profundidades', 'forma', 'uso', 'foto', 'hojaSeguridad', 'fichaTecnica']) {
            if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
                setError(`El campo ${field} es requerido.`);
                return;
            }
        }

        if (formData.bombas.length === 0) {
            setError('Debe agregar al menos una bomba.');
            return;
        }

        for (let i = 0; i < formData.bombas.length; i++) {
            const bomba = formData.bombas[i];
            for (const field of ['marca', 'referencia', 'potencia', 'material', 'foto']) {
                 if (!bomba[field] || (typeof bomba[field] === 'string' && !bomba[field].trim())) {
                    setError(`Todos los campos de la bomba ${i + 1} son requeridos, incluyendo la foto.`);
                    return;
                }
            }
        }

        const data = new FormData();
        
        // Append all fields to FormData, processing 'profundidades' and 'bombas' specially
        for (const key in formData) {
            if (key === 'profundidades') {
                const profundidadesArray = formData.profundidades
                    .split(',')
                    .map(p => parseFloat(p.trim()))
                    .filter(p => !isNaN(p) && p > 0);

                if (profundidadesArray.length === 0) {
                    setError('Las profundidades deben contener números válidos y positivos.');
                    return;
                }

                for (let i = 0; i < profundidadesArray.length - 1; i++) {
                    if (profundidadesArray[i] >= profundidadesArray[i + 1]) {
                        setError('Las profundidades deben estar en orden ascendente.');
                        return;
                    }
                }
                data.append(key, JSON.stringify(profundidadesArray));

            } else if (key === 'bombas') {
                formData.bombas.forEach((bomba, index) => {
                    for (const bombaKey in bomba) {
                        data.append(`bombas[${index}][${bombaKey}]`, bomba[bombaKey]);
                    }
                });
            } else {
                data.append(key, formData[key]);
            }
        }

        try {
            await createPool(data);
            navigate('/pools');
        } catch (err) {
            console.error('Failed to create pool:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Error al crear la piscina. Verifique los datos.';
            setError(errorMessage);
        }
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Crear Nueva Piscina</Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField name="nombre" label="Nombre" value={formData.nombre} onChange={handleChange} fullWidth margin="normal" required />
                <TextField name="direccion" label="Dirección" value={formData.direccion} onChange={handleChange} fullWidth margin="normal" required />
                <TextField name="altura" label="Altura (metros)" type="number" value={formData.altura} onChange={handleChange} fullWidth margin="normal" required />
                <TextField name="ancho" label="Ancho (metros)" type="number" value={formData.ancho} onChange={handleChange} fullWidth margin="normal" required />

                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Departamento</InputLabel>
                    <Select name="municipio" value={formData.municipio} label="Departamento" onChange={handleMunicipioChange}>
                        {colombiaData.map((depto) => (
                            <MenuItem key={depto.id} value={depto.departamento}>
                                {depto.departamento}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" required disabled={!formData.municipio}>
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

                <TextField name="profundidades" label="Profundidades (separadas por coma, en orden asc.)" value={formData.profundidades} onChange={handleChange} fullWidth margin="normal" required />
                
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
                
                <Box sx={{ mt: 2, mb: 1, border: '1px dashed grey', p: 2, borderRadius: 1 }}>
                    <Button variant={formData.foto ? "contained" : "outlined"} component="label" fullWidth color={formData.foto ? "success" : "primary"}>
                        {formData.foto ? "Foto Principal Cargada" : "Subir Foto Principal (PNG/JPEG)"}
                        <input type="file" name="foto" hidden onChange={handleFileChange} accept="image/png, image/jpeg" />
                    </Button>
                    {formData.foto && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="textSecondary">Archivo: {formData.foto.name}</Typography>
                        </Box>
                    )}
                </Box>
                
                <Box sx={{ mt: 2, mb: 1, border: '1px dashed grey', p: 2, borderRadius: 1 }}>
                    <Button variant={formData.hojaSeguridad ? "contained" : "outlined"} component="label" fullWidth color={formData.hojaSeguridad ? "success" : "primary"}>
                        {formData.hojaSeguridad ? "Hoja de Seguridad Cargada" : "Subir Hoja de Seguridad (PDF)"}
                        <input type="file" name="hojaSeguridad" hidden onChange={handleFileChange} accept="application/pdf" />
                    </Button>
                    {formData.hojaSeguridad && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="textSecondary">Archivo: {formData.hojaSeguridad.name}</Typography>
                        </Box>
                    )}
                </Box>

                <Box sx={{ mt: 2, mb: 2, border: '1px dashed grey', p: 2, borderRadius: 1 }}>
                    <Button variant={formData.fichaTecnica ? "contained" : "outlined"} component="label" fullWidth color={formData.fichaTecnica ? "success" : "primary"}>
                        {formData.fichaTecnica ? "Ficha Técnica Cargada" : "Subir Ficha Técnica (PDF)"}
                        <input type="file" name="fichaTecnica" hidden onChange={handleFileChange} accept="application/pdf" />
                    </Button>
                    {formData.fichaTecnica && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="textSecondary">Archivo: {formData.fichaTecnica.name}</Typography>
                        </Box>
                    )}
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
                        <Box sx={{ mt: 1, border: '1px dashed grey', p: 2, borderRadius: 1 }}>
                             <Button variant={bomba.foto ? "contained" : "outlined"} component="label" fullWidth color={bomba.foto ? "success" : "primary"}>
                                {bomba.foto ? "Foto de Bomba Cargada" : "Subir Foto de Bomba"}
                                <input type="file" name="foto" hidden onChange={(e) => handleBombaFileChange(index, e)} accept="image/png, image/jpeg" />
                            </Button>
                            {bomba.foto && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                                    <Typography variant="body2" color="textSecondary">Archivo: {typeof bomba.foto === 'string' ? bomba.foto : bomba.foto.name}</Typography>
                                </Box>
                            )}
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
