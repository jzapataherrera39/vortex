import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { createPool } from '../../api/poolsApi';

const CreatePool = () => {
    const navigate = useNavigate();
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
        uso: '',
        foto: null,
        hojaSeguridad: null,
        fichaTecnica: null,
        bombas: [],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    }

    const handleBombaChange = (index, e) => {
        const newBombas = [...formData.bombas];
        newBombas[index][e.target.name] = e.target.value;
        setFormData({ ...formData, bombas: newBombas });
    }

    const handleBombaFileChange = (index, e) => {
        const newBombas = [...formData.bombas];
        newBombas[index][e.target.name] = e.target.files[0];
        setFormData({ ...formData, bombas: newBombas });
    }

    const addBomba = () => {
        setFormData({ ...formData, bombas: [...formData.bombas, { marca: '', referencia: '', potencia: '', material: '', seRepite: 'no', totalBombas: 1, foto: null }] });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const poolData = new FormData();
        for (const key in formData) {
            if (key === 'bombas') {
                formData.bombas.forEach((bomba, index) => {
                    for (const bombaKey in bomba) {
                        poolData.append(`bombas[${index}][${bombaKey}]`, bomba[bombaKey]);
                    }
                });
            } else {
                poolData.append(key, formData[key]);
            }
        }
        await createPool(poolData);
        navigate('/pools');
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Create Pool</Typography>
            <form onSubmit={handleSubmit}>
                <TextField name="nombre" label="Nombre" onChange={handleChange} fullWidth margin="normal" />
                <TextField name="direccion" label="Dirección" onChange={handleChange} fullWidth margin="normal" />
                <TextField name="altura" label="Altura" onChange={handleChange} fullWidth margin="normal" />
                <TextField name="ancho" label="Ancho" onChange={handleChange} fullWidth margin="normal" />
                <TextField name="ciudad" label="Ciudad" onChange={handleChange} fullWidth margin="normal" />
                <TextField name="municipio" label="Municipio" onChange={handleChange} fullWidth margin="normal" />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Categoría</InputLabel>
                    <Select name="categoria" value={formData.categoria} onChange={handleChange}>
                        <MenuItem value="Niños">Niños</MenuItem>
                        <MenuItem value="Adultos">Adultos</MenuItem>
                    </Select>
                </FormControl>
                <TextField name="profundidades" label="Profundidades (comma separated)" onChange={handleChange} fullWidth margin="normal" />
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
                <Button variant="contained" component="label">
                    Upload Foto
                    <input type="file" name="foto" hidden onChange={handleFileChange} />
                </Button>
                <Button variant="contained" component="label">
                    Upload Hoja de Seguridad
                    <input type="file" name="hojaSeguridad" hidden onChange={handleFileChange} />
                </Button>
                <Button variant="contained" component="label">
                    Upload Ficha Técnica
                    <input type="file" name="fichaTecnica" hidden onChange={handleFileChange} />
                </Button>

                <Typography variant="h5" gutterBottom>Bombas</Typography>
                {formData.bombas.map((bomba, index) => (
                    <div key={index}>
                        <TextField name="marca" label="Marca" value={bomba.marca} onChange={(e) => handleBombaChange(index, e)} fullWidth margin="normal" />
                        <TextField name="referencia" label="Referencia" value={bomba.referencia} onChange={(e) => handleBombaChange(index, e)} fullWidth margin="normal" />
                        <TextField name="potencia" label="Potencia" value={bomba.potencia} onChange={(e) => handleBombaChange(index, e)} fullWidth margin="normal" />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Material</InputLabel>
                            <Select name="material" value={bomba.material} onChange={(e) => handleBombaChange(index, e)}>
                                <MenuItem value="Sumergible">Sumergible</MenuItem>
                                <MenuItem value="Centrifuga">Centrifuga</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Se Repite?</InputLabel>
                            <Select name="seRepite" value={bomba.seRepite} onChange={(e) => handleBombaChange(index, e)}>
                                <MenuItem value="si">Si</MenuItem>
                                <MenuItem value="no">No</MenuItem>
                            </Select>
                        </FormControl>
                        {bomba.seRepite === 'si' && (
                            <TextField name="totalBombas" label="Total Bombas" type="number" value={bomba.totalBombas} onChange={(e) => handleBombaChange(index, e)} fullWidth margin="normal" />
                        )}
                        <Button variant="contained" component="label">
                            Upload Bomba Foto
                            <input type="file" name="foto" hidden onChange={(e) => handleBombaFileChange(index, e)} />
                        </Button>
                    </div>
                ))}
                <Button onClick={addBomba}>Add Bomba</Button>

                <Button type="submit" variant="contained" color="primary">Create Pool</Button>
            </form>
        </Container>
    );
};

export default CreatePool;
