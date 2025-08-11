const { Schema, model } = require("mongoose");

const AgencyGHL = new Schema(
  {
    agency_apikey: { type: String },
    location_id: { type: Schema.Types.Mixed },
    company_id: { type: String },
    refresh_token: { type: String },
    access_token: { type: String },
    app_id: { type: String },
  },
  { _id: false }
);

const SubApps = new Schema(
  {
    email: { type: String },
    password: { type: String },
    companyId: { type: String },
  },
  { _id: false }
);
const SubApp = new Schema(
  {
    consumerKey: { type: String },
    consumerSecret: { type: String },
    url: { type: String },
  },
  { _id: false }
);
const All_App_Cred = new Schema(
  {
    api_key: { type: String },
    email: { type: String },
    password: { type: String },
    type: { type: String },
  },
  { _id: false }
);
const FreeAppToken = new Schema(
  {
    location_id: { type: String },
    company_id: { type: String },
    GHLuserId: { type: String },
    refresh_token: { type: String, required: false },
    access_token: { type: String, required: false },
    connection_status: { type: String },
    type: { type: String },
    api_key_status: { type: Boolean, default: false },
    activeLocations: { type: Array, default: [] },
    agency_id: { type: String },
    app_id: { type: String, required: true },
    all_app_cred: All_App_Cred,
    Ghl: AgencyGHL,
    app_cred: { type: Object },
    credentials: { type: Object },
    cred: SubApp,
    stripe: Object,

    name: { type: String },
    description: { type: String },
    image: { type: String },
    payments_url: { type: String },
    query_url: { type: String },
    merch_id: { type: String },
    surcharge: { type: String },
    
    app_key: { type: String },
    secret_key: { type: String },
    api_key: { type: String },
    domain: { type: String },
    logoUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = model("FreeAppToken", FreeAppToken);
