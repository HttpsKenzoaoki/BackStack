import { sequelize } from '../config/database.js';
import Animal from './Animal.js';
import Tutor from './Tutor.js';
import Questionario from './Questionario.js';
import Adocao from './Adocao.js';
import Doacao from './Doacao.js';


Tutor.hasOne(Questionario, {
  foreignKey: 'tutor_id',
  as: 'questionario'
});
Questionario.belongsTo(Tutor, {
  foreignKey: 'tutor_id',
  as: 'tutor'
});


Tutor.hasMany(Adocao, {
  foreignKey: 'tutor_id',
  as: 'pedidos_adocao'
});
Adocao.belongsTo(Tutor, {
  foreignKey: 'tutor_id',
  as: 'tutor'
});

Animal.hasMany(Adocao, {
  foreignKey: 'animal_id',
  as: 'pedidos_adocao'
});
Adocao.belongsTo(Animal, {
  foreignKey: 'animal_id',
  as: 'animal'
});


export {
  sequelize,
  Animal,
  Tutor,
  Questionario,
  Adocao,
  Doacao
};