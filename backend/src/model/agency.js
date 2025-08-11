const { Schema, model } = require('mongoose')
const AgencyGHL = new Schema(
  {
    agency_apikey: { type: String },
    location_apikey: { type: String },
    location_id: { type: String },
    company_id: { type: String },
    refresh_token: { type: String },
    access_token: { type: String },
  },
  { _id: false }
)
const Stripe = new Schema(
  {
    key: { type: String },
    refresh_token: { type: String },
    publish_key: { type: String },
    user_id: { type: String },
    customer_id: { type: String },
    access_token: { type: String },
  },
  { _id: false }
)
const Agency = new Schema(
  {
    name: { type: String, trim: true },
    sideNavColor: {
      type: String,
      default: 'info',
      enum: ['primary', 'dark', 'info', 'success', 'warning', 'error'],
    },
    sideNavType: {
      type: String,
      default: 'dark',
      enum: ['dark', 'transparent', 'white'],
    },
    navbarFixed: { type: Boolean, default: true },
    light: { type: Boolean, default: true },
    domain: { type: String },
    active: { type: Boolean },
    ghl: AgencyGHL,
    agency_ghl: AgencyGHL,
    stripe: Stripe,
    active_users: { type: Array },
    default_user: { type: String },
    app_id: { type: String },
    deleted: { type: Boolean, default: false },
    workflows: { type: Object },
    app_data: { type: Object },
    profile: { type: Object },
    branding: {},
    urlGroups: {},
    generalInfo: {},
    logoUrl: { type: String },
  },
  { timestamps: true }
)

module.exports = model('Agency', Agency)
