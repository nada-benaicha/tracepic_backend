
module.exports = (sequelize, Sequelize) => {
	const Bloc = sequelize.define('blocs', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		titreBloc :  {
			type: Sequelize.STRING
		},
		description : {
			type: Sequelize.STRING
		},
		objectif: {
			type: Sequelize.STRING
		},
		parametres: {
			type: Sequelize.STRING
		}

	});

	return Bloc;
}

