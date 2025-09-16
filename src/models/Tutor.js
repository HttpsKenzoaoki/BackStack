import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcrypt';

const Tutor = sequelize.define('Tutor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nome_completo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    }
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 2] 
    }
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 18, 
      max: 120
    }
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isNumeric: true,
    }
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  facebook: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
}, {
  tableName: 'tutores',
  timestamps: true,
  hooks: {
   

    beforeCreate: async (tutor) => {
      if (tutor.senha) {
        tutor.senha = await bcrypt.hash(tutor.senha, 10);
      }
    },
    beforeUpdate: async (tutor) => {
      if (tutor.changed('senha')) {
        tutor.senha = await bcrypt.hash(tutor.senha, 10);
      }
    }
  }
});


Tutor.prototype.verificarSenha = async function(senha) {
  return await bcrypt.compare(senha, this.senha);
};

export default Tutor;