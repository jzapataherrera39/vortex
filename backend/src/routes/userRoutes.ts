import { Router } from 'express';
import { getUsers, createUser, updateUser, toggleUserStatus, getUserById, deleteUser } from '../controllers/userController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = Router();

router.route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

// Esta es la ruta clave que faltaba para inactivar
router.route('/:id/toggle')
  .put(protect, admin, toggleUserStatus);

export default router;