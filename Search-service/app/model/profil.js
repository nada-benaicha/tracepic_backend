module.exports = (sequelize, Sequelize) => {
	const Profil = sequelize.define('profil', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		logo: {
			type: Sequelize.STRING
		},
		rcs: {
			type: Sequelize.STRING
		},
		presentation: {
			type: Sequelize.STRING
		},
		siteWeb: {
			type: Sequelize.STRING
		},

		mailContact : {
			type: Sequelize.STRING
		},
		adresseLabo : {
			type: Sequelize.STRING
		},
		codePostale: {
			type: Sequelize.STRING
		},
	

	});


	return Profil;
}
