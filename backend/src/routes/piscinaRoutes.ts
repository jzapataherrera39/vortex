import { Router } from 'express';
import { createPiscina, getPiscinas, getPiscinaById, updatePiscina, deletePiscina } from '../controllers/piscinaController';
import { protect, admin } from '../middlewares/authMiddleware';
import upload from '../middlewares/uploadHandler';
import { piscinaValidationRules } from '../middlewares/piscinaValidator';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

// Define the fields for multer.
// This accepts a main 'foto', two documents, and up to 10 pump photos.
const uploadFields = [
    { name: 'foto', maxCount: 1 },
    { name: 'hojaSeguridad', maxCount: 1 },
    { name: 'fichaTecnica', maxCount: 1 },
    ...Array.from({ length: 10 }, (_, i) => ({ name: `bombas[${i}][foto]`, maxCount: 1 }))
];

router.route('/')
  .get(protect, getPiscinas)
  .post(protect, admin, upload.fields(uploadFields), piscinaValidationRules(), validateRequest, createPiscina);

router.route('/:id')
  .get(protect, getPiscinaById)
  .put(protect, admin, upload.fields(uploadFields), piscinaValidationRules(), validateRequest, updatePiscina)
  .delete(protect, admin, deletePiscina);

export default router;

