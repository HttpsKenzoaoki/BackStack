import { DataTypes } from "sequelize";
import { sequelize } from '../config/database.js';

const Animal = sequelize.define("Animal", {
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
    especie: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    porte: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['pequeno', 'médio', 'grande']]
        }
    },
    castrado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    vacinado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    adotado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    foto: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
    }
}, {
    tableName: "animais",
    timestamps: true,
});

export default Animal;