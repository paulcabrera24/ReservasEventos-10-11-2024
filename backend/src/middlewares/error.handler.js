export const errorHandler = (err, req, res, next) => {
  console.error(err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.message
    });
  }

  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
};