import { Doacao } from '../models/index.js';

class DoacaoController {
  async criarDoacao(req, res) {
    try {
      const { nome, email, valor, mensagem } = req.body;

      }

      }


      const doacao = await Doacao.create({
        status: 'pendente',
        pix_payload: pixPayload,
        qr_code_base64: qrCodeBase64
      });

        doacao_id: doacao.id,
        valor: doacao.valor,
        linkPix: pixPayload,
      });
    } catch (error) {
    }
  }
}

export default new DoacaoController();