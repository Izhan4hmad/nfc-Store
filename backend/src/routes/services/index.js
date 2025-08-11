const enums = require("../../_enums/enums")

const middleware = '/api/v1/services/'

const GHL = require("./ghl/routes")

const initializeServices = (app) => {
  app.use(middleware + 'ghl', GHL)
};

module.exports = initializeServices;
