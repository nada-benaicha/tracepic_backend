const env = require('./env.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
  define: { timestamps: false },
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../model/user.model.js')(sequelize, Sequelize);
db.profil = require('../model/profil')(sequelize, Sequelize);
db.personnel = require('../model/personnel')(sequelize, Sequelize);
db.machine =  require('../model/machine')(sequelize, Sequelize);
db.project =  require('../model/project')(sequelize, Sequelize);
db.experience =  require('../model/experience')(sequelize, Sequelize);

db.user.hasMany(db.profil, { foreignKey: 'userId', as: 'Profils' }); 
db.profil.belongsTo(db.user, { foreignKey: 'userId' });

db.profil.hasMany(db.personnel, { foreignKey: 'profilId', as: 'Personnels' }); 
db.personnel.belongsTo(db.profil, { foreignKey: 'profilId' });

db.profil.hasMany(db.machine, { foreignKey: 'profilId', as: 'Machines' }); 
db.machine.belongsTo(db.profil, { foreignKey: 'profilId' });

db.profil.hasMany(db.project, { foreignKey: 'profilLaboId', as: 'Projects' }); 
db.project.belongsTo(db.profil, { foreignKey: 'profilLaboId' });

db.project.hasMany(db.experience, { foreignKey: 'projectId', as: 'Experiences' }); 
db.experience.belongsTo(db.project, { foreignKey: 'projectId' });
module.exports = db;