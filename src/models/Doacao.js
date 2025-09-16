import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Doacao = sequelize.define('Doacao', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true,
    }
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01 
    }
  },
  mensagem: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendente',
    validate: {
      isIn: [['pendente', 'pago', 'cancelado']]
    }
  },
  pix_payload: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  qr_code_base64: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'doacoes',
  timestamps: true,
});

export default Doacao;