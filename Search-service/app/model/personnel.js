
module.exports = (sequelize, Sequelize) => {
	const Personnel = sequelize.define('personnel', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		nomPrenomPersonel : {
			type: Sequelize.STRING
		}, 
        adresseEmail : {
			type: Sequelize.STRING
		}, 
		poste : {
			type: Sequelize.STRING
		}

	});


	return Personnel;
}
