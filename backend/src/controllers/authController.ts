import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_default_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { nombre, apellido, cedula, email, password, rol } = req.body; // <-- FIX

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      nombre,
      apellido,
      cedula,
      email,
      password, // <-- FIX
      rol,
    });

    res.status(201).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      token: generateToken(user._id),
    });
    

  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body; // <-- FIX

  try {
    const user = await User.findOne({ email });

    if (user && user.state === 'inactivo') {
      return res.status(401).json({ message: 'User is inactive' });
    }

    if (user && (await user.matchPassword(password))) { // <-- FIX
      res.json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('AUTH ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
