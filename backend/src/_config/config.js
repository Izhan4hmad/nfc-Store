const { ENV, ResponseStatus } = require('../_enums/enums')
const path = require('path')
// cs1.ew5ss7oof7lm1982nuvrwbke093i5grcg5uyygp94c5mqo36kj
// cid.n6esk6gvu9upp8ugdv2xbig1v
// shippo_live_fa6ffacb3ce41270ae5aa32239758ea39da60bd4
const env = {
  port: 8082,
  corsOption: '',
  clientside: 'http://localhost:3001',

  mongodb_uri:
    'mongodb+srv://dowrites:07V53pJ8xQ4dW91j@levelupmarketplace-db-62a30117.mongo.ondigitalocean.com/nfc_store?replicaSet=levelupmarketplace-db&tls=true&authSource=admin&retryWrites=true&w=majority',
  // 'mongodb+srv://doadmin:O1z94rk8l23x0NA6@lump-db-dev-dcc2ef5c.mongo.ondigitalocean.com/lump?tls=true&authSource=admin', // Dev-DB
  // "mongodb+srv://dowrites:07V53pJ8xQ4dW91j@levelupmarketplace-db-62a30117.mongo.ondigitalocean.com/lump?replicaSet=levelupmarketplace-db&tls=true&authSource=admin&retryWrites=true&w=majority",
  // "mongodb+srv://admin:pi6qy12WMwmwFGx1@prod-ghlappstore.tzfqvrk.mongodb.net/Superadmin?retryWrites=true&w=majority",
  // mongodb_uri: "mongodb://localhost:27017",
  AWS_REGION: 'fra1',
  AWS_ACCESS_KEY_ID: 'DO00U98TD7GNQUVPZ276',
  AWS_SECRET_KEY: 'VIp4RFqqp4jHOR0HCW0wCQRKy43V/Ezs4ESE95xe0Hk',
  AWS_BUCKET: 'snapshotstore',
  DO_ENDPOINT: 'fra1.digitaloceanspaces.com',
  SUPER_ADMIN: '6298acc76bcf0340b4ec6b6b',
  STRIPE_KEY: 'sk_test_H2uv7BR3WR0Q8Zm7OOYQvd6v',
  GHL: {
    ALL_THE_APPS: {
      CLIENT_ID: '670ce982292541018a34fb9a-m7m4l0i4',
      CLIENT_SECRET: 'cb63e359-c3bc-45ed-9b0b-c673755b9f14',
    },
    CLIENT_ID: '64f8604282165264339a0ccc-lm7nf7n0',
    CLIENT_SECRET: '84249575-8af0-44bf-adb0-d8cf81d6cecb',
    Location_CLIENT_ID: '64f8770dcbb4d2884275dbb1-lm7qwbtu',
    Location_CLIENT_SECRET: 'fc8bf3b7-8e84-4986-80f6-c9cafcc5ccbc',
    SUPER_ADMIN_Location_CLIENT_ID: '668fce5baff239cd7461ffb7-lyh97gk6',
    SUPER_ADMIN_Location_CLIENT_SECRET: '6cff26fc-9308-4b33-9147-d945766ab67a',
    Location_SCOPE:
      'contacts.readonly contacts.write campaigns.readonly conversations.readonly conversations.write forms.readonly conversations/message.write links.readonly links.write conversations/message.readonly locations.readonly locations/customFields.readonly locations/customFields.write locations/customValues.write locations/customValues.readonly locations/tags.write locations/tags.readonly locations/tasks.write locations/tasks.readonly opportunities.readonly opportunities.write locations/templates.readonly surveys.readonly users.write users.readonly workflows.readonly',
    SCOPE:
      'contacts.readonly contacts.write locations.readonly locations/customFields.readonly locations/customFields.write workflows.readonly users.readonly users.write campaigns.readonly conversations/message.readonly conversations/message.write locations/customValues.readonly locations/customValues.write opportunities.readonly opportunities.write forms.readonly links.readonly links.write surveys.readonly locations/tasks.readonly locations/tasks.write locations/tags.readonly locations/tags.write locations/templates.readonly snapshots.readonly locations.write',
    REDIRECT: {
      LOCAITON: 'https://app.snapshotstore.io/integrations/ghl/location',
      BUSINESS: 'https://app.snapshotstore.io/integrations/ghl/business',
      AGENCY: 'http://localhost:3020/integrations/ghl/agency',
      SUPER_ADMIN: 'https://app.snapshotstore.io/integrations/ghl/sadmin',
      Location_ASSOCIATE: 'https://app.snapshotstore.io/agency/auth',
      SuperAdmin_ASSOCIATE: 'https://app.snapshotstore.io/superadmin/auth',
      ASSOCIATE: 'https://app.snapshotstore.io/agency/auth/agency',
    },
  },
}

if (process.env.NODE_ENV === ENV.STAGING) {
  const corsOption = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: ResponseStatus.SUCCESS,
  }

  env.corsOption = corsOption
  env.STRIPE_KEY = 'sk_live_F1pvN8YXlIwTMRdmwa91TxZ3'
}

if (process.env.NODE_ENV === ENV.PRODUCTION) {
  // env.STRIPE_KEY = 'sk_live_F1pvN8YXlIwTMRdmwa91TxZ3'
  env.mongodb_uri =
    'mongodb+srv://dowrites:07V53pJ8xQ4dW91j@levelupmarketplace-db-62a30117.mongo.ondigitalocean.com/nfc_store?replicaSet=levelupmarketplace-db&tls=true&authSource=admin&retryWrites=true&w=majority'
  // 'mongodb+srv://admin:pi6qy12WMwmwFGx1@prod-ghlappstore.tzfqvrk.mongodb.net/Superadmin?retryWrites=true&w=majority'
  // const whitelistDomains = []
  // function Origin (origin, callback) {
  //     //console.log(origin);
  //     if (whitelistDomains.indexOf(origin) !== -1 || !origin) {
  //       callback(null, true)
  //     } else {
  //       callback(new Error('Not allowed by CORS'))
  //     }
  // }
  // const corsOption = {
  //     origin                  : Origin,
  //     methods                 : 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //     optionsSuccessStatus    : ResponseStatus.SUCCESS
  // }
}

module.exports = env
