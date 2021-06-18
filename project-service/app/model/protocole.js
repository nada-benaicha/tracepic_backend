
module.exports = (sequelize, Sequelize) => {
	const Protocole = sequelize.define('protocoles', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		titreProtocole :  {
			type: Sequelize.STRING
		},
		description : {
			type: Sequelize.STRING
		},
		objectif: {
			type: Sequelize.STRING
		}

	});

	return Protocole;
}

