
module.exports = (sequelize, Sequelize) => {
	const Project = sequelize.define('projects', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		titreProjet :  {
			type: Sequelize.STRING
		},
		description : {
			type: Sequelize.STRING
		},
		objectif: {
			type: Sequelize.STRING
		},
		dateDeb : {
			type: Sequelize.DATE,
			defaultValue: null
		},
		dateFin : {
			type: Sequelize.DATE,
			defaultValue: null
		},
		statut : {
			type: Sequelize.STRING
		}


	});

	return Project;
}

