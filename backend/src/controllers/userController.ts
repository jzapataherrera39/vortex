import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-contraseña');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.nombre = req.body.nombre || user.nombre;
            user.apellido = req.body.apellido || user.apellido;
            user.cedula = req.body.cedula || user.cedula;
            user.email = req.body.email || user.email;
            user.rol = req.body.rol || user.rol;
            user.state = req.body.state || user.state;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                nombre: updatedUser.nombre,
                email: updatedUser.email,
                rol: updatedUser.rol,
                state: updatedUser.state,
            });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'Usuario eliminado' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// @desc    Update user state (activate/deactivate)
// @route   PUT /api/users/:id/state
// @access  Private/Admin
const setUserState = async (req: Request, res: Response) => {
  try {
    const { state } = req.body;

    if (!['activo', 'inactivo'].includes(state)) {
      return res.status(400).json({ message: 'El estado debe ser "activo" o "inactivo"' });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.state = state;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        nombre: updatedUser.nombre,
        email: updatedUser.email,
        rol: updatedUser.rol,
        state: updatedUser.state,
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export { getUsers, getUserById, updateUser, deleteUser, setUserState };
