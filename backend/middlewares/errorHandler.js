const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      message: 'Erreur de validation',
      errors
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field} déjà utilisé`
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token invalide'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expiré'
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'ID invalide'
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Erreur interne du serveur'
  });
};

module.exports = errorHandler;
