const { auth_data_collections } = require("../../_utils/Collections");
const ghl = require("../ghl");
const apps = require("../apps");
const ServiceTitan = require("../ServiceTitan");
const jobnimbus = require("../jobnimbus");
const acculynx = require("../acculynx");
var cron = require("node-cron");

// const CronJob = require("cron").CronJob;
// */2 * * * *
const RefreshGHLTokens = cron.schedule("0 0 */23 * * *", async function () {
  console.log("App Token GHL Refresh Token CronJob Called");
  const collections = ["free_app_token"];
  collections.forEach((collection) => ghl.UpdateToken(collection));
});
const RefreshServiceM8Tokens = cron.schedule("*/45 * * * *", async function () {
  console.log("Service M8 Refresh Token CronJob Called");
  const collections = ["app_token", "free_app_token"];
  collections.forEach((collection) => apps.UpdateServiceM8Token(collection));
});
const RefreshZoomTokens = cron.schedule("*/55 * * * *", async function () {
  console.log("Zoom Refresh Token CronJob Called");
  const collections = ["app_token", "free_app_token"];
  collections.forEach((collection) => apps.UpdateZoomToken(collection));
});
const JobNimbusTriggers = cron.schedule("*/30 * * * *", async function () {
  console.log("JobNimbus Triggers Called");
  jobnimbus.GetJobNimbusData();
});
const acculynxTriggers = cron.schedule("*/30 * * * *", async function () {
  console.log("acculynx Triggers Called");
  acculynx.GetAcculynxData();
});
const ServiceTitanTriggers = cron.schedule("*/30 * * * *", async function () {
  console.log("Service Titan Triggers Called");
  const collections = [
    "jobs",
    "customers",
    "appointments",
    "leads",
    "bookings",
    "estimates",
    "invoices",
    "submissions",
    "payments",
    "purchase_orders",
  ];
  collections.forEach((collection) => ServiceTitan.TriggerHandler(collection));
});
const RefreshServiceTitanTokens = cron.schedule(
  "*/10 * * * *",
  async function () {
    console.log("Service Titan Refresh Token CronJob Called");
    apps.UpdateServiceTitanAccessToken();
  }
);
const RefreshAppAuthTokens = cron.schedule("0 0 */23 * * *", async function () {
  console.log("Auth Apps GHL Refresh Token CronJob Called");
  const collectionkeys = Object.keys(auth_data_collections);
  console.log(collectionkeys, "collectionkeyscollectionkeyscollectionkeys");
  collectionkeys.forEach((collection) => ghl.UpdateAppsAuthToken(collection));
});
const RefreshAgencyTokens = cron.schedule("0 0 */23 * * *", async function () {
  console.log("Agency GHL Refresh Token CronJob Called");
  const collections = ["agency", "location", "super_admin_location"];
  collections.forEach((collection) => ghl.UpdateAgencyToken(collection));
});
const RefreshPdfGenratorTokens = cron.schedule("0 16 * * 0", async function () {
  console.log("Pdf Genrator Refresh Token CronJob Called");
  const collections = ["app_token", "free_app_token"];
  collections.forEach((collection) => apps.UpdatepdgGenraotrToken(collection));
});
const RefreshSVUTokens = cron.schedule("0 0 */23 * * *", async function () {
  console.log("SVU Refresh Token CronJob Called");
  apps.UpdateSVUToken();
});
module.exports = {
  RefreshGHLTokens,
  RefreshAgencyTokens,
  RefreshAppAuthTokens,
  RefreshServiceM8Tokens,
  RefreshServiceTitanTokens,
  ServiceTitanTriggers,
  RefreshPdfGenratorTokens,
  RefreshZoomTokens,
  JobNimbusTriggers,
  acculynxTriggers,
  RefreshSVUTokens,
};
