const requestCounts = new Map();
const blockedIPs = new Map();

setInterval(() => {
  requestCounts.clear();
  const agora = Date.now();
  for (const [ip, timestamp] of blockedIPs.entries()) {
    if (agora - timestamp > 15 * 60 * 1000) { 
      blockedIPs.delete(ip);
    }
  }
}, 60 * 1000);

export const rateLimitGeral = (limite = 100) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;

    if (blockedIPs.has(ip)) {
      return res.status(429).json({
        erro: 'IP temporariamente bloqueado devido a excesso de requisições'
      });
    }

    const agora = Date.now();
    const janela = Math.floor(agora / (60 * 1000)); 
    const chave = `${ip}:${janela}`;
    
    const contador = requestCounts.get(chave) || 0;
    
    if (contador >= limite) {
      blockedIPs.set(ip, agora);
      return res.status(429).json({
        erro: 'Limite de requisições excedido. Tente novamente em alguns minutos.'
      });
    }
    
    requestCounts.set(chave, contador + 1);

    res.set({
      'X-RateLimit-Limit': limite,
      'X-RateLimit-Remaining': limite - contador - 1,
      'X-RateLimit-Reset': new Date((janela + 1) * 60 * 1000).toISOString()
    });
    
    next();
  };
};

export const rateLimitLogin = rateLimitGeral(10); 
export const rateLimitAPI = rateLimitGeral(60);   