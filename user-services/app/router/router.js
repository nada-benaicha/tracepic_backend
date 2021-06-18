
const verifySignUp = require('./verifySignUp');
const VerifyToken = require('./verifyJwtToken');

module.exports = function (app) {

	const controller = require('../controller/controller.js');

    app.post('/api/userServices/signup', controller.signup);
    app.post('/api/userServices/verify', controller.verify);
    app.post('/api/userServices/ValidationAdmin', controller.ValidationAdmin);
    app.post('/api/userServices/getwalletFileAndDecrypt', controller.getwalletFileAndDecrypt);
    app.post('/api/userServices/signin', controller.signin);
    app.post('/api/userServices/addUpdateProfil', controller.addUpdateProfil);
    app.post('/api/userServices/addPersonnel', controller.addPersonnel);
    app.post('/api/userServices/updatePersonnel', controller.updatePersonnel);
    app.get('/api/userServices/getPersonnelLabo/:profilId', controller.getPersonnelLabo);
    app.delete('/api/userServices/deletePersonnel', controller.deletePersonnel);
    app.get('/api/userServices/getPersonnelLabo/:profilId', controller.getPersonnelLabo);

    app.post('/api/userServices/getAccount', controller.getAccount);

    app.get('/api/userServices/getProfil/:userId', controller.getProfil);

    app.post('/api/userServices/getListLabo', controller.getListLabo);

    app.post('/api/userServices/getListClient', controller.getListClient);

    app.delete('/api/userServices/deleteClient', controller.deleteClient);

    app.post('/api/userServices/updateInfoClient', controller.updateInfoClient);

    app.post('/api/userServices/addMachine', controller.addMachine);
    app.post('/api/userServices/updateMachine', controller.updateMachine);
    app.get('/api/userServices/getMachineLabo/:profilId', controller.getMachineLabo);
    app.delete('/api/userServices/deleteMachine', controller.deleteMachine);
}