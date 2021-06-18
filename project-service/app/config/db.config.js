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
db.protocole =  require('../model/protocole')(sequelize, Sequelize);
db.exprimentalGroup =  require('../model/exprimentalGroup')(sequelize, Sequelize);
db.operation =  require('../model/operation')(sequelize, Sequelize);
db.typeOperation =  require('../model/typeOperation')(sequelize, Sequelize);

db.bloc =  require('../model/bloc')(sequelize, Sequelize);
db.typeBloc =  require('../model/typeBloc')(sequelize, Sequelize);

db.user.hasMany(db.profil, { foreignKey: 'userId', as: 'Profils' }); 
db.profil.belongsTo(db.user, { foreignKey: 'userId' });

db.profil.hasMany(db.personnel, { foreignKey: 'profilId', as: 'Personnels' }); 
db.personnel.belongsTo(db.profil, { foreignKey: 'profilId' });

db.profil.hasMany(db.machine, { foreignKey: 'profilId', as: 'Machines' }); 
db.machine.belongsTo(db.profil, { foreignKey: 'profilId' });

db.profil.hasMany(db.project, { foreignKey: 'profilLaboId', as: 'Projects' }); 
db.project.belongsTo(db.profil, { foreignKey: 'profilLaboId' });

db.project.hasMany(db.protocole, { foreignKey: 'projectId', as: 'Protocoles' }); 
db.protocole.belongsTo(db.project, { foreignKey: 'projectId' });

db.protocole.hasMany(db.exprimentalGroup, { foreignKey: 'protocolId', as: 'ExprimentalGroups' }); 
db.exprimentalGroup.belongsTo(db.protocole, { foreignKey: 'protocolId' });

db.exprimentalGroup.hasMany(db.operation, { foreignKey: 'groupId', as: 'Operations' }); 
db.operation.belongsTo(db.exprimentalGroup, { foreignKey: 'groupId' });

db.typeOperation.hasMany(db.operation, { foreignKey: 'typeOperationId', as: 'TypeOperations' }); 
db.operation.belongsTo(db.typeOperation, { foreignKey: 'typeOperationId' });

db.protocole.hasMany(db.bloc, { foreignKey: 'protocolId', as: 'Blocs' }); 
db.bloc.belongsTo(db.protocole, { foreignKey: 'protocolId' });

db.typeBloc.hasMany(db.bloc, { foreignKey: 'typeBlocId', as: 'TypeBlocs' }); 
db.bloc.belongsTo(db.typeBloc, { foreignKey: 'typeBlocId' });

db.machine.hasMany(db.bloc, { foreignKey: 'machineId', as: 'MachineBloc' }); 
db.bloc.belongsTo(db.machine, { foreignKey: 'machineId' });
module.exports = db;