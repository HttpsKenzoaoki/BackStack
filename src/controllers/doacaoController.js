import { Doacao } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

function onlyDigits(str) {
  return String(str || '').replace(/\D/g, '');
}

function toAsciiUpper(str, maxLen) {
  const noAccents = String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return noAccents.replace(/[^ -~]/g, '').toUpperCase().slice(0, maxLen); // ASCII visível
}

function sanitizeTxid(prefix = 'BACKSTACK') {
  const base = `${prefix}${Date.now().toString(36)}`.toUpperCase();
  return base.replace(/[^A-Z0-9]/g, '').slice(0, 25) || 'BACKSTACK';
}

function sanitizeMessage(str) {
  const ascii = String(str || 'DOACAO').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return ascii.replace(/[^A-Za-z0-9 .,_-]/g, '').slice(0, 50); // simples e curto
}

class DoacaoController {
  async criarDoacao(req, res) {
    try {
      const { nome, email, valor, mensagem } = req.body;

      if (!nome || !email || valor === undefined) {
        return res.status(400).json({ erro: 'Nome, email e valor são obrigatórios' });
      }

      const valorNum = Number(valor);
      if (!Number.isFinite(valorNum) || valorNum <= 0) {
        return res.status(400).json({ erro: 'Valor da doação deve ser um número positivo' });
      }

      const rawKey = process.env.PIX_KEY || '52343878000123';
      const pixKey = /^[0-9]{14}$/.test(onlyDigits(rawKey)) ? onlyDigits(rawKey) : String(rawKey).trim();

      const merchantName = toAsciiUpper(process.env.PIX_MERCHANT_NAME || 'ONG AMIGOS ANIMAIS', 25);
      const merchantCity = toAsciiUpper(process.env.PIX_MERCHANT_CITY || 'SAO PAULO', 15);
      const txid = sanitizeTxid(process.env.PIX_TXID_PREFIX || 'BACKSTACK');
      const msg = sanitizeMessage(mensagem || 'Doacao');

      const { QrCodePix } = await import('qrcode-pix');
      const qrCodePix = QrCodePix({
        version: '01',
        key: pixKey,
        name: merchantName,
        city: merchantCity,
        transactionId: txid,
        message: msg,
        value: valorNum
      });

      const pixPayload = qrCodePix.payload();
      const qrCodeBase64 = await qrCodePix.base64();

      const doacao = await Doacao.create({
        nome: String(nome).trim(),
        email: String(email).trim().toLowerCase(),
        valor: valorNum,
        mensagem: String(mensagem || '').trim(),
        status: 'pendente',
        pix_payload: pixPayload,
        qr_code_base64: qrCodeBase64
      });

      return res.status(201).json({
        mensagem: 'Obrigado por contribuir!',
        doacao_id: doacao.id,
        valor: doacao.valor,
        qrcode: qrCodeBase64,
        linkPix: pixPayload,
        txid
      });
    } catch (error) {
      console.error('Erro ao processar doação PIX:', error);
      return res.status(500).json({ erro: 'Erro ao processar a doação PIX' });
    }
  }
}

export default new DoacaoController();