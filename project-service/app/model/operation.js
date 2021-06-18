
module.exports = (sequelize, Sequelize) => {
	const Operation = sequelize.define('operations', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		nomOperation :  {
			type: Sequelize.STRING
		},
		nbJours: {
			type: Sequelize.INTEGER
		},
		nbOperationParJour: {
			type: Sequelize.INTEGER
		}

	});

	return Operation;
}

