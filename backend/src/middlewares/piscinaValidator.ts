import { body, validationResult } from 'express-validator';

export const piscinaValidationRules = () => [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('direccion').trim().notEmpty().withMessage('La dirección es requerida'),
  body('altura')
    .trim()
    .notEmpty().withMessage('La altura es requerida')
    .isFloat({ gt: 0 }).withMessage('La altura debe ser un número positivo'),
  body('ancho')
    .trim()
    .notEmpty().withMessage('El ancho es requerido')
    .isFloat({ gt: 0 }).withMessage('El ancho debe ser un número positivo'),
  body('ciudad').trim().notEmpty().withMessage('La ciudad es requerida'),
  body('municipio').trim().notEmpty().withMessage('El municipio es requerido'),
  body('categoria').isIn(['Niños', 'Adultos']).withMessage('Categoría inválida'),
  body('profundidades')
    .trim()
    .notEmpty().withMessage('Las profundidades son requeridas')
    .custom((value) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error('Debe proporcionar al menos una profundidad');
        }
        for (let i = 0; i < parsed.length; i++) {
          const depth = parseFloat(parsed[i]);
          if (isNaN(depth) || depth <= 0) {
            throw new Error(`Las profundidades deben ser números positivos (posición ${i})`);
          }
        }
        if (parsed.length > 1) {
          for (let i = 0; i < parsed.length - 1; i++) {
            if (parseFloat(parsed[i]) >= parseFloat(parsed[i + 1])) {
              throw new Error('Las profundidades deben estar en orden ascendente');
            }
          }
        }
        return true;
      } catch (err: any) {
        throw new Error(`Profundidades: ${err.message}`);
      }
    }),
  body('forma').isIn(['Rectangular', 'Circular']).withMessage('Forma inválida'),
  body('uso').isIn(['Privada', 'Publica']).withMessage('Uso inválido'),
];