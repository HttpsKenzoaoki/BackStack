import { Doacao } from '../models/index.js';

class DoacaoController {
  async criarDoacao(req, res) {
    try {
      const { nome, email, valor, mensagem } = req.body;

      if (!nome || !email || !valor) {
        return res.status(400).json({
          erro: "Nome, email e valor são obrigatórios"
        });
      }

      if (valor <= 0) {
        return res.status(400).json({
          erro: "Valor da doação é obrigatório e deve ser um número positivo"
        });
      }

      const pixPayload = `00020126580014BR.GOV.BCB.PIX0136ong.adocao@exemplo.com5204000053039865405${valor.toFixed(2).padStart(6, '0')}5802BR5920ONG Amigos Animais6009Sao Paulo62070503***6304ABCD`;
      const qrCodeBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAADh0RVh0U29mdHdhcmUAbWF0cGxvdGxpYiB2ZXJzaW9uMy4yLjIsIGh0dHA6Ly9tYXRwbG90bGliLm9yZy+WH4yJAAAFxUlEQVR4nO3dMWobQRiG4VkSCxeCwYcIFAK2wUegNOkMbdJKbXqfoU2aNj5Cjp..."; // QR Code simulado

      const doacao = await Doacao.create({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        valor: parseFloat(valor),
        mensagem: mensagem?.trim() || '',
        status: 'pendente',
        pix_payload: pixPayload,
        qr_code_base64: qrCodeBase64
      });

      res.status(201).json({
        doacao_id: doacao.id,
        nome: doacao.nome,
        valor: doacao.valor,
        mensagem: doacao.mensagem,
        linkPix: pixPayload,
        qrcode: qrCodeBase64
      });

    } catch (error) {
      console.error('Erro ao processar doação:', error);
      res.status(500).json({
        erro: "Erro ao processar a doação"
      });
    }
  }
}

export default new DoacaoController();