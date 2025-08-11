import { Environment } from '../enums'

const env = {
  API_URL: 'https://api.alltheapps.io/api',
  AI_API_URL: 'https://aiapi.alltheapps.io',
  // API_URL: 'http://localhost:8082/api',
  // AI_API_URL: 'http://localhost:8082/api',

  GHL: {
    // CLIENT_ID: '64f8604282165264339a0ccc-lm7nf7n0',
    // CLIENT_SECRET: '84249575-8af0-44bf-adb0-d8cf81d6cecb',

    CLIENT_ID: '668fce5baff239cd7461ffb7-lyh97gk6',
    CLIENT_SECRET: '6cff26fc-9308-4b33-9147-d945766ab67a',
    Location_CLIENT_ID: '668fce5baff239cd7461ffb7-lyh97gk6',
    Location_CLIENT_SECRET: '6cff26fc-9308-4b33-9147-d945766ab67a',
    Location_SCOPE:
      'conversations.readonly conversations.write conversations/message.readonly conversations/message.write contacts.write contacts.readonly',
    Levelup_Marketplace_CLIENT_ID: '678e762b1da40dd3ef027da0-m65920ga',
    Levelup_Marketplace_CLIENT_SECRET: 'ce430f2a-7620-4c54-b17e-f47cba9bb45e',
    Levelup_Marketplace_SCOPE:
      'locations.readonly users.readonly users.write contacts.readonly contacts.write',

    SCOPE:
      'contacts.readonly contacts.write locations.readonly locations/customFields.readonly locations/customFields.write workflows.readonly users.readonly users.write campaigns.readonly conversations/message.readonly conversations/message.write locations/customValues.readonly locations/customValues.write opportunities.readonly opportunities.write forms.readonly links.readonly links.write surveys.readonly locations/tasks.readonly locations/tasks.write locations/tags.readonly locations/tags.write locations/templates.readonly',
    REDIRECT: {
      ASSOCIATE: 'https://superadmin.levelupmarketplace.com/integrations/associate',
      LEVELUP_MARKETPLACE: 'http://localhost:3000/integrations/associate/levelup_marketplace',
      AGENCY: 'https://superadmin.levelupmarketplace.com/integrations/associate/agency',
    },
  },
}

if (process.env.REACT_APP_ENV === Environment.DEVELOPMENT) {
  env.API_URL = 'https://api.alltheapps.io/api'
  env.GHL.REDIRECT.ASSOCIATE = 'https://superadmin.levelupmarketplace.com/integrations/associate'
  env.GHL.REDIRECT.LEVELUP_MARKETPLACE =
    'https://superadmin.levelupmarketplace.com/integrations/levelup_marketplace'
}
if (process.env.REACT_APP_ENV === Environment.PRODUCTION) {
  env.API_URL = 'https://api.alltheapps.io/api'
  env.GHL.REDIRECT.LEVELUP_MARKETPLACE =
    'https://superadmin.levelupmarketplace.com/integrations/levelup_marketplace'
}
export default env
