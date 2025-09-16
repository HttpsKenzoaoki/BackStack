export const configurarSeguranca = (req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  });

  res.removeHeader('X-Powered-By');

  next();
};

export const sanitizarInput = (req, res, next) => {
  const sanitizar = (obj) => {
    if (typeof obj === 'string') {
      return obj.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitizado = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitizado[key] = sanitizar(value);
      }
      return sanitizado;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizar(req.body);
  }
  if (req.query) {
    req.query = sanitizar(req.query);
  }

  next();
};