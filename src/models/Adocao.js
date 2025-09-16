import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Adocao = sequelize.define('Adocao', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tutor_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tutores',
      key: 'id'
    }
  },
  animal_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'animais',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'em_analise',
    validate: {
      isIn: [['em_analise', 'aprovado', 'rejeitado', 'cancelado', 'concluido']]
    }
  },
  posicao_fila: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'adocoes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['tutor_id', 'animal_id']
    }
  ]
});

export default Adocao;