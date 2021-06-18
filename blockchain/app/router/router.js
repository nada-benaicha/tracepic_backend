module.exports = function (app) {
  const controller = require("../contoller/contoller");
      app.post("/api/createProjet", controller.createProjet);
      app.post("/api/createProtocole", controller.createProtocole);
      app.post("/api/addBlockToProtocole", controller.addBlockToProtocole);
      app.post("/api/addGroupToProtocole", controller.addGroupToProtocole);
      app.post("/api/addOperationTogroup", controller.addOperationTogroup);
      app.post("/api/getAllProjetForLab", controller.getAllProjetForLab);
      app.post("/api/getAllProtocoleForLab", controller.getAllProtocoleForLab);
      app.post("/api/getBlockOfProtocole", controller.getBlockOfProtocole);
      app.post("/api/getGroupOfProtocole", controller.getGroupOfProtocole);
      app.post("/api/getOperationOfGroup", controller.getOperationOfGroup);
};
