// Middleware simple de autenticación para demo
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No autorizado - Token requerido' });
  }

  // Demo: validación simple de token estático
  if (token === process.env.JWT_SECRET_DEMO) {
    req.user = { id: 'demo-user', role: 'admin' };
    next();
  } else {
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;
