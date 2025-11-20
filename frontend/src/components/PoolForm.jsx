import React, { useState, useEffect } from 'react';
import { colombiaData } from '../data/colombia';

const PoolForm = ({ initialData = {}, onSubmit, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    altura: '',
    ancho: '',
    departamento: '',
    municipio: '',
    temperaturaExterna: '',
    categoria: 'Adultos',
    totalProfundidades: 1,
    profundidades: [''],
    forma: 'Rectangular',
    uso: 'Privada',
    foto: null,
    bombas: [],
    ...initialData,
  });

  const [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    if (formData.departamento) {
      const selectedDept = colombiaData.find(d => d.departamento === formData.departamento);
      setMunicipios(selectedDept ? selectedDept.ciudades : []);
    } else {
      setMunicipios([]);
    }
  }, [formData.departamento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, index, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (field === 'foto') {
      setFormData(prev => ({ ...prev, foto: file }));
    } else {
      const newBombas = [...formData.bombas];
      newBombas[index][field] = file;
      setFormData(prev => ({ ...prev, bombas: newBombas }));
    }
  };

  // --- Profundidades Logic ---
  const handleProfundidadesCountChange = (e) => {
    const count = Math.max(1, parseInt(e.target.value, 10) || 1);
    const newProfundidades = Array(count).fill('');
    setFormData(prev => ({ ...prev, totalProfundidades: count, profundidades: newProfundidades }));
  };

  const handleProfundidadChange = (index, value) => {
    const newProfundidades = [...formData.profundidades];
    newProfundidades[index] = value;
    setFormData(prev => ({ ...prev, profundidades: newProfundidades }));
  };

  // --- Bombas Logic ---
  const handleAddBomba = () => {
    setFormData(prev => ({
      ...prev,
      bombas: [...prev.bombas, {
        marca: '',
        referencia: '',
        foto: null,
        potencia: '',
        material: 'Sumergible',
        seRepite: 'no',
        totalBombas: 1,
        hojaSeguridad: null,
        fichaTecnica: null,
      }]
    }));  };

  const handleRemoveBomba = (index) => {
    const newBombas = formData.bombas.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, bombas: newBombas }));
  };
  
  const handleBombaChange = (index, field, value) => {
    const newBombas = [...formData.bombas];
    newBombas[index][field] = value;
    setFormData(prev => ({ ...prev, bombas: newBombas }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would use a service to upload files and then submit formData
    console.log('Form Data Submitted:', formData);
    alert('Submitting data (see console). File upload to be implemented.');
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg space-y-4">
      
      {/* Basic Info */}
      <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre de la piscina" required className="input-style" />
      <input name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección" className="input-style" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input name="altura" type="number" value={formData.altura} onChange={handleChange} placeholder="Altura (m)" required className="input-style" />
        <input name="ancho" type="number" value={formData.ancho} onChange={handleChange} placeholder="Ancho (m)" required className="input-style" />
        <input name="temperaturaExterna" type="number" value={formData.temperaturaExterna} onChange={handleChange} placeholder="Temp. Externa (°C)" className="input-style" />
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select name="departamento" value={formData.departamento} onChange={handleChange} required className="input-style">
          <option value="">Seleccione Departamento</option>
          {colombiaData.map(d => <option key={d.departamento} value={d.departamento}>{d.departamento}</option>)}
        </select>
        <select name="municipio" value={formData.municipio} onChange={handleChange} required className="input-style" disabled={!formData.departamento}>
          <option value="">Seleccione Municipio</option>
          {municipios.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      
      {/* Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select name="categoria" value={formData.categoria} onChange={handleChange} className="input-style">
          <option value="Adultos">Adultos</option>
          <option value="Niños">Niños</option>
        </select>
        <select name="forma" value={formData.forma} onChange={handleChange} className="input-style">
          <option value="Rectangular">Rectangular</option>
          <option value="Circular">Circular</option>
        </select>
        <select name="uso" value={formData.uso} onChange={handleChange} className="input-style">
          <option value="Privada">Privada</option>
          <option value="Pública">Pública</option>
        </select>
      </div>
      
      {/* File Upload */}
       <div>
         <label>Foto Principal (PNG/JPEG):</label>
         <input type="file" name="foto" onChange={(e) => handleFileChange(e, null, 'foto')} accept="image/png, image/jpeg" className="input-style" />
       </div>

      {/* Profundidades */}
      <div className="p-4 border rounded">
        <label>Total de Profundidades:</label>
        <input type="number" min="1" value={formData.totalProfundidades} onChange={handleProfundidadesCountChange} required className="input-style w-20 ml-2" />
        {formData.profundidades.map((prof, index) => (
          <input key={index} type="number" placeholder={`Profundidad ${index + 1} (m)`} value={prof} onChange={(e) => handleProfundidadChange(index, e.target.value)} required className="input-style mt-2" />
        ))}
      </div>

      {/* Bombas */}
      <div className="p-4 border rounded">
        <h3 className="text-lg font-semibold">Bombas</h3>
        {formData.bombas.map((bomba, index) => (
          <div key={index} className="p-3 my-2 border rounded space-y-2">
            <h4 className="font-bold">Bomba {index + 1}</h4>
            <input type="text" placeholder="Marca" value={bomba.marca} onChange={(e) => handleBombaChange(index, 'marca', e.target.value)} className="input-style" />
            <input type="text" placeholder="Referencia" value={bomba.referencia} onChange={(e) => handleBombaChange(index, 'referencia', e.target.value)} className="input-style" />
            <input type="number" placeholder="Potencia (HP)" value={bomba.potencia} onChange={(e) => handleBombaChange(index, 'potencia', e.target.value)} className="input-style" />
             <select value={bomba.material} onChange={(e) => handleBombaChange(index, 'material', e.target.value)} className="input-style">
                <option value="Sumergible">Sumergible</option>
                <option value="Centrifuga">Centrífuga</option>
            </select>
            <div className="flex items-center gap-4">
              <label>¿Se repite esta bomba?</label>
              <select value={bomba.seRepite} onChange={(e) => handleBombaChange(index, 'seRepite', e.target.value)} className="input-style">
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
              {bomba.seRepite === 'si' && (
                <input type="number" min="1" placeholder="Total" value={bomba.totalBombas} onChange={(e) => handleBombaChange(index, 'totalBombas', e.target.value)} className="input-style w-24" />
              )}
            </div>
            <label>Foto Bomba (PNG/JPEG):</label>
            <input type="file" onChange={(e) => handleFileChange(e, index, 'foto')} accept="image/png, image/jpeg" className="input-style" />
            <label>Hoja de Seguridad (PDF):</label>
            <input type="file" onChange={(e) => handleFileChange(e, index, 'hojaSeguridad')} accept="application/pdf" className="input-style" />
            <label>Ficha Técnica (PDF):</label>
            <input type="file" onChange={(e) => handleFileChange(e, index, 'fichaTecnica')} accept="application/pdf" className="input-style" />
            <button type="button" onClick={() => handleRemoveBomba(index)} className="bg-red-500 text-white p-2 rounded">Eliminar Bomba</button>
          </div>
        ))}
        <button type="button" onClick={handleAddBomba} className="bg-green-500 text-white p-2 rounded mt-2">Agregar Bomba</button>
      </div>

      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {isEditMode ? 'Actualizar Piscina' : 'Crear Piscina'}
      </button>
    </form>
  );
};

// Add this to your index.css or a global stylesheet
/*
.input-style {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline;
}
*/

export default PoolForm;