
module.exports = (sequelize, Sequelize) => {
	const ExprimentalGroup = sequelize.define('exprimentalGroups', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		nomGroupe :  {
			type: Sequelize.STRING
		},
		nature : {
			type: Sequelize.STRING
		},
		nbElement: {
			type: Sequelize.INTEGER
		},
		description: {
			type: Sequelize.STRING
		}

	});

	return ExprimentalGroup;
}

