
import { Request, Response } from 'express';
import Piscina from '../models/Piscina';
import { uploadFromBuffer, deleteFromCloudinary } from '../utils/cloudinaryUploader';

// Helper function to get public_id from cloudinary url
const getPublicId = (url: string) => {
    const parts = url.split('/');
    const publicIdWithExt = parts.slice(-2).join('/');
    return publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
}

// @desc    Create a new piscina
// @route   POST /api/piscinas
// @access  Private/Admin
const createPiscina = async (req: Request, res: Response) => {
    try {
        const { nombre, direccion, altura, ancho, ciudad, municipio, categoria, profundidades, forma, uso, ...rest } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // --- File Uploads ---
        let fotoUrl, hojaSeguridadUrl, fichaTecnicaUrl;
        if (files.foto) {
            const result = await uploadFromBuffer(files.foto[0].buffer, 'piscinas/fotos');
            fotoUrl = result.secure_url;
        }
        if (files.hojaSeguridad) {
            const result = await uploadFromBuffer(files.hojaSeguridad[0].buffer, 'piscinas/documentos');
            hojaSeguridadUrl = result.secure_url;
        }
        if (files.fichaTecnica) {
            const result = await uploadFromBuffer(files.fichaTecnica[0].buffer, 'piscinas/documentos');
            fichaTecnicaUrl = result.secure_url;
        }

        if (!fotoUrl || !hojaSeguridadUrl || !fichaTecnicaUrl) {
            return res.status(400).json({ message: 'Faltan archivos requeridos (foto, hojaSeguridad, fichaTecnica)' });
        }

        // --- Dynamic Bomba Handling ---
        const bombasData = [];
        const bombasFromRequest = req.body.bombas || [];
        for (let i = 0; i < bombasFromRequest.length; i++) {
            const bombaInfo = bombasFromRequest[i];
            const bombaFile = files[`bombas[${i}][foto]`] ? files[`bombas[${i}][foto]`][0] : null;

            if (!bombaFile) {
                return res.status(400).json({ message: `Falta la foto para la bomba ${i}` });
            }
            const uploadResult = await uploadFromBuffer(bombaFile.buffer, 'piscinas/bombas');

            const bomba = {
                marca: bombaInfo.marca,
                referencia: bombaInfo.referencia,
                potencia: bombaInfo.potencia,
                material: bombaInfo.material,
                foto: uploadResult.secure_url,
		seRepite: bombaInfo.seRepite,
		totalBombas: bombaInfo.totalBombas
            };

            if (bombaInfo.seRepite === 'si' && bombaInfo.totalBombas) {
                const count = parseInt(bombaInfo.totalBombas, 10);
                for (let j = 0; j < count; j++) {
                    bombasData.push(bomba);
                }
            } else {
                bombasData.push(bomba);
            }
        }

        const piscina = new Piscina({
            nombre,
            direccion,
            altura,
            ancho,
            ciudad,
            municipio,
            categoria,
            profundidades: JSON.parse(profundidades),
            forma,
            uso,
            foto: fotoUrl,
            hojaSeguridad: hojaSeguridadUrl,
            fichaTecnica: fichaTecnicaUrl,
            bombas: bombasData,
            ...rest
        });

        const createdPiscina = await piscina.save();
        res.status(201).json(createdPiscina);

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// @desc    Get all piscinas
// @route   GET /api/piscinas
// @access  Private
const getPiscinas = async (req: Request, res: Response) => {
    try {
        const piscinas = await Piscina.find({});
        res.json(piscinas);
    } catch (error: any) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// @desc    Get piscina by ID
// @route   GET /api/piscinas/:id
// @access  Private
const getPiscinaById = async (req: Request, res: Response) => {
    try {
        const piscina = await Piscina.findById(req.params.id);
        if (piscina) {
            res.json(piscina);
        } else {
            res.status(404).json({ message: 'Piscina no encontrada' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// @desc    Update a piscina
// @route   PUT /api/piscinas/:id
// @access  Private/Admin
const updatePiscina = async (req: Request, res: Response) => {
    try {
        const piscina = await Piscina.findById(req.params.id);

        if (!piscina) {
            return res.status(404).json({ message: 'Piscina no encontrada' });
        }

        const { nombre, direccion, altura, ancho, ciudad, municipio, categoria, profundidades, forma, uso, ...rest } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // --- File Updates ---
        if (files.foto) {
            await deleteFromCloudinary(getPublicId(piscina.foto));
            const result = await uploadFromBuffer(files.foto[0].buffer, 'piscinas/fotos');
            piscina.foto = result.secure_url;
        }
        if (files.hojaSeguridad) {
            await deleteFromCloudinary(getPublicId(piscina.hojaSeguridad));
            const result = await uploadFromBuffer(files.hojaSeguridad[0].buffer, 'piscinas/documentos');
            piscina.hojaSeguridad = result.secure_url;
        }
        if (files.fichaTecnica) {
            await deleteFromCloudinary(getPublicId(piscina.fichaTecnica));
            const result = await uploadFromBuffer(files.fichaTecnica[0].buffer, 'piscinas/documentos');
            piscina.fichaTecnica = result.secure_url;
        }

		// --- Update Fields ---
		piscina.nombre = nombre || piscina.nombre;
		piscina.direccion = direccion || piscina.direccion;
		piscina.altura = altura || piscina.altura;
		piscina.ancho = ancho || piscina.ancho;
		piscina.ciudad = ciudad || piscina.ciudad;
		piscina.municipio = municipio || piscina.municipio;
		piscina.categoria = categoria || piscina.categoria;
		piscina.profundidades = profundidades ? JSON.parse(profundidades) : piscina.profundidades;
		piscina.forma = forma || piscina.forma;
		piscina.uso = uso || piscina.uso;

        const updatedPiscina = await piscina.save();
        res.json(updatedPiscina);

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// @desc    Delete a piscina
// @route   DELETE /api/piscinas/:id
// @access  Private/Admin
const deletePiscina = async (req: Request, res: Response) => {
    try {
        const piscina = await Piscina.findById(req.params.id);

        if (piscina) {
            // Delete files from Cloudinary
            await deleteFromCloudinary(getPublicId(piscina.foto));
            await deleteFromCloudinary(getPublicId(piscina.hojaSeguridad));
            await deleteFromCloudinary(getPublicId(piscina.fichaTecnica));
            for (const bomba of piscina.bombas) {
                await deleteFromCloudinary(getPublicId(bomba.foto));
            }

            await piscina.deleteOne();
            res.json({ message: 'Piscina eliminada' });
        } else {
            res.status(404).json({ message: 'Piscina no encontrada' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

export { createPiscina, getPiscinas, getPiscinaById, updatePiscina, deletePiscina };
