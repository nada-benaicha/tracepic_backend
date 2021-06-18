
module.exports = (sequelize, Sequelize) => {
	const TypeOperation = sequelize.define('typeOperations', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		typeOperation :  {
			type: Sequelize.STRING
		}

	});

	return TypeOperation;
}

