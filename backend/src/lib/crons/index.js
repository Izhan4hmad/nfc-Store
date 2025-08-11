const {
  RefreshGHLTokens,
  RefreshAppAuthTokens,
  RefreshAgencyTokens,
  RefreshServiceM8Tokens,
  RefreshServiceTitanTokens,
  ServiceTitanTriggers,
  RefreshPdfGenratorTokens,
  RefreshZoomTokens,
  JobNimbusTriggers,
  acculynxTriggers,
  RefreshSVUTokens,
} = require("./refresh-ghl-tokens");

const start = function ({ JobName, all = false }) {
  const Jobs = [
    RefreshGHLTokens,
    RefreshAppAuthTokens,
    RefreshAgencyTokens,
    RefreshServiceM8Tokens,
    RefreshServiceTitanTokens,
    RefreshSVUTokens,
    RefreshPdfGenratorTokens,
    RefreshZoomTokens,
  ];
  if (all) return Jobs.forEach((job) => job.start());
};
module.exports = {
  start,
};
