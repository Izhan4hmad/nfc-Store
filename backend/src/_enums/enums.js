const ENV = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
};
const ReqMethods = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
  ALL: "all",
};

const TaskStatus = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PENDING: 'pending'
}

const ResponseStatus = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

const ResponseMessages = {
  INTERNAL_ERROR: "Internal server error",
  VALIDATION_ERROR: "Invalid or missing field",
  AUTH_ERROR: "Access denied invalid credentials",
  FORBIDDEN: "Forbidden, you don't have permission to access",
};
const AccessTokenTablesKey = {
  JOBNIMBUSLOC: "JobNimbusLocationsModel",
  ACCULYNXLOC: "AcculynxLocationsModel",
  CALENDERWIDGETLOC: "CalenderWidgetLocationsModel",
  LOCDASHLOC: "LocDashLocationsModel",
  TRANSACTIONAPPLOC: "TransactionAppLocationsModel",
};
const AccessTokenTypes = {
  MAIN: "main",
  GHL: "ghl",
  AGENCY_GHL: "agency_ghl",
};
const ConnectionTypes = {
  BRAND: "brand",
};

const GHLAppStoreEvents = {
  PRODUCT_PURCHASE: "product_purchase",
  GHL_INTEGRATE: "ghl_integrate",
  AGENCY_USER: "agency_user",
};

module.exports = {
  ENV,
  ReqMethods,
  ResponseStatus,
  ResponseMessages,
  ConnectionTypes,
  GHLAppStoreEvents,
  AccessTokenTablesKey,
  AccessTokenTypes,
  user: require("./user"),
  TaskStatus
};
//https://agencyapp.levelupmarketplace.io/alltheapps/64f218cb9bace7699ea417b8/{{location.Id}}/{{company.Id}}?type=free
//
