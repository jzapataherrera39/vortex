import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Pump sub-document
export interface IBomba {
  marca: string;
  referencia: string;
  foto: string; // URL to image
  potencia: string;
  material: 'Sumergible' | 'Centrifuga';
  seRepite: 'si' | 'no';
  totalBombas?: number;
}

// Interface for the main Piscina document
export interface IPiscina extends Document {
  nombre: string;
  direccion: string;
  altura: number;
  ancho: number;
  ciudad: string;
  municipio: string;
  temperaturaExterna?: number;
  categoria: 'Niños' | 'Adultos';
  profundidades: number[];
  forma: 'Rectangular' | 'Circular';
  uso: 'Privada' | 'Publica';
  foto: string; // URL to image
  bombas: IBomba[];
  hojaSeguridad: string; // URL to PDF
  fichaTecnica: string; // URL to PDF
}

const BombaSchema: Schema = new Schema({
  marca: { type: String, required: true },
  referencia: { type: String, required: true },
  foto: { type: String, required: true },
  potencia: { type: String, required: true },
  material: { type: String, enum: ['Sumergible', 'Centrifuga'], required: true },
  seRepite: { type: String, enum: ['si', 'no'], required: true },
  totalBombas: { type: Number },
});

const PiscinaSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  altura: { type: Number, required: true },
  ancho: { type: Number, required: true },
  ciudad: { type: String, required: true },
  municipio: { type: String, required: true },
  temperaturaExterna: { type: Number },
  categoria: { type: String, enum: ['Niños', 'Adultos'], required: true },
  profundidades: {
    type: [Number],
    required: true,
    validate: {
      validator: function (v: number[]) {
        if (v.length === 0) return true;
        for (let i = 0; i < v.length - 1; i++) {
          if (v[i] >= v[i + 1]) {
            return false;
          }
        }
        return true;
      },
      message: 'Las profundidades deben estar en orden ascendente.'
    }
  },
  forma: { type: String, enum: ['Rectangular', 'Circular'], required: true },
  uso: { type: String, enum: ['Privada', 'Publica'], required: true },
   estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  foto: { type: String, required: true },
  bombas: [BombaSchema],
  hojaSeguridad: { type: String, required: true },
 fichaTecnica: { type: String, required: true },
 
});

export default mongoose.model<IPiscina>('Piscina', PiscinaSchema);
