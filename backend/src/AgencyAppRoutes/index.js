const enums = require("../_enums/enums");

const middleware = "/api/agency_app/";
const initializeServices = require("./services");

const custom_value = require("./custom_value/routes");
const nfcBundle = require("./nfc_bundle/router");

const initializeEndpoints = (app) => {
  initializeServices(app);
  
  app.use(middleware + "nfc_bundle", nfcBundle);

  app.use(middleware + "custom_value", custom_value);
};

module.exports = initializeEndpoints;
