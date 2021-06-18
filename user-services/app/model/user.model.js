
module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('users', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		fullName :  {
			type: Sequelize.STRING
		},
		nomResponsable : {
			type: Sequelize.STRING
		},
		nomLaboratoire: {
			type: Sequelize.STRING
		},
		email: {
			type: Sequelize.STRING
		},
		mobile : {
			type: Sequelize.STRING
		},
		pays: {
			type: Sequelize.STRING
		},
		CodeEmailVerification: {
			type: Sequelize.STRING
		},
		role: {
			type: Sequelize.STRING
		},
		detailRole: {
			type: Sequelize.STRING
		},
			isVerified: {
			type: Sequelize.STRING,
			 defaultValue: "0"
		},
		password : {
			type: Sequelize.STRING
		},
		dateInscription : {
			type: Sequelize.DATE,
			defaultValue: null
		},
		walletUri : {
			type: Sequelize.STRING
		},
		token : {
			type: Sequelize.STRING
		},
		ExpiredIn : {
			type: Sequelize.STRING
		}

	});

	return User;
}

