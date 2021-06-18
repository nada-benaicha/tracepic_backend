
const VerifyToken = require('./verifyJwtToken');

module.exports = function (app) {

    const controller = require('../controller/controller.js');

    app.post('/api/searchServices/searchPersonnels', controller.searchPersonnels);

    app.post('/api/searchServices/searchMachines', controller.searchMachines);

    // app.post('/api/searchServices/searchProject', controller.searchProject);

    
    
}