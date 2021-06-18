
module.exports = (sequelize, Sequelize) => {
	const TypeBloc = sequelize.define('typeBlocs', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		typeBloc :  {
			type: Sequelize.STRING
		}
		

	});

	return TypeBloc;
}

