import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';


dotenv.config(); 

// --- AGREGA ESTE BLOQUE DE PRUEBA ---
console.log("--- CLOUDINARY CONFIG CHECK ---");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key existe:", !!process.env.CLOUDINARY_API_KEY); // Imprime true si existe
console.log("API Secret existe:", !!process.env.CLOUDINARY_API_SECRET); // Imprime true si existe
console.log("-------------------------------");
// -------------------------------------

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
