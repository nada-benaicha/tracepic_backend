
const verifySignUp = require('./verifySignUp');
const VerifyToken = require('./verifyJwtToken');

module.exports = function (app) {

	const controller = require('../controller/controller.js');
    app.post('/api/projectServices/addNewProject', controller.addNewProject);
    // app.post('/api/projectServices/addNewExperience', controller.addNewExperience);
    // app.get('/api/projectServices/getDetailsProject/:projectId', controller.getDetailsProject);
    app.post('/api/projectServices/addNewProtocole', controller.addNewProtocole);
    app.post('/api/projectServices/addExprimentalGroup', controller.addExprimentalGroup);

    app.get('/api/projectServices/getAllTypeOperation', controller.getAllTypeOperation);

    app.get('/api/projectServices/getAllProjectForLabo/:profilLaboId', controller.getAllProjectForLabo);

    app.post('/api/projectServices/addBloc', controller.addBloc);
    app.get('/api/projectServices/getAllTypeBloc', controller.getAllTypeBloc);

    app.get('/api/projectServices/getAllBlocForSpecificProtocol/:protocolId', controller.getAllBlocForSpecificProtocol);
   
    app.post('/api/projectServices/getDetailsBloc', controller.getDetailsBloc);

	
    
}