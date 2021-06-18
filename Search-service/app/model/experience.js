
module.exports = (sequelize, Sequelize) => {
	const Experience = sequelize.define('experiences', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		nomExperience :  {
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
		dateInsertion: {
			type: Sequelize.DATE,
			defaultValue: null
		}

	});

	return Experience;
}

