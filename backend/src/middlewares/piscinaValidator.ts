import { body } from 'express-validator';

export const piscinaValidationRules = () => [
  body('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  body('direccion').not().isEmpty().withMessage('La dirección es requerida'),
  body('altura').isFloat({ gt: 0 }).withMessage('La altura debe ser un número positivo'),
  body('ancho').isFloat({ gt: 0 }).withMessage('El ancho debe ser un número positivo'),
  body('ciudad').not().isEmpty().withMessage('La ciudad es requerida'),
  body('municipio').not().isEmpty().withMessage('El municipio es requerido'),
  body('categoria').isIn(['Niños', 'Adultos']).withMessage('Categoría inválida'),
  body('profundidades').isArray({ min: 1 }).withMessage('Debe proporcionar al menos una profundidad'),
  body('profundidades.*').isFloat({ gt: 0 }).withMessage('Las profundidades deben ser números positivos'),
  body('forma').isIn(['Rectangular', 'Circular']).withMessage('Forma inválida'),
  body('uso').isIn(['Privada', 'Publica']).withMessage('Uso inválido'),
];