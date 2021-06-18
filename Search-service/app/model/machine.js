
module.exports = (sequelize, Sequelize) => {
	const Machine = sequelize.define('machine', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		marque : {
			type: Sequelize.STRING
		}, 
        numeroSerie : {
			type: Sequelize.STRING
		}

	});


	return Machine;
}
