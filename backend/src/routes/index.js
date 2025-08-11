const enums = require("../_enums/enums");

const middleware = "/api/v1/";
const initializeServices = require("./services");

const nfcbusiness = require("./nfcbusiness/routes");
const nfc = require("./nfc/routes");
const nfc_action = require("./nfc_action/routes");
const nfc_users = require("./nfc_users/routes");
const nfc_package = require("./nfc_package/routes");
const productsPage = require("./productsPage/routes");
const utils = require("./utils/routes");

const initializeEndpoints = (app) => {
  initializeServices(app);

  app.use(middleware + "nfcbusiness", nfcbusiness);
  app.use(middleware + "nfc", nfc);
  app.use(middleware + "nfc_action", nfc_action);
  app.use(middleware + "nfc_users", nfc_users);
  app.use(middleware + "nfc_package", nfc_package);
  app.use(middleware + "productsPage", productsPage);
  app.use(middleware + "utils", utils);
};

module.exports = initializeEndpoints;
