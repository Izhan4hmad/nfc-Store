import { Environment } from '../enums';

interface GHLRedirect {
    ASSOCIATE: string;
}
interface GHLCredentials {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    APPSCOPE: string;
    SUPER_ADMIN_CLIENT_ID: string;
    SUPER_ADMIN_CLIENT_SECRET: string;
    SUPER_ADMIN_SCOPE: string;
    REDIRECT: GHLRedirect;
}
interface EnvironmentConfig {
    API_URL: string;
    GHL: GHLCredentials;
}

const env: EnvironmentConfig = {
    API_URL: 'http://localhost:8082',
    // API_URL: 'http://nfc-store-api.alltheapps.io',
    GHL: {
        CLIENT_ID: '6790c0edaa6c7659754e4682-m7kfqvlh',
        CLIENT_SECRET: '11822047-6cda-4934-83bb-64dccafdd11b',
        APPSCOPE:
            'users.readonly locations.readonly companies.readonly users.write oauth.readonly oauth.write contacts.readonly contacts.write conversations.readonly conversations.write conversations/message.readonly conversations/message.write custom-menu-link.write custom-menu-link.write custom-menu-link.readonly',
        SUPER_ADMIN_CLIENT_ID: '67dc81ac43540d6ccc840c10-m8hud0gt',
        SUPER_ADMIN_CLIENT_SECRET: '5dd1959a-a08d-41d3-bb6b-3fd100313345',
        SUPER_ADMIN_SCOPE: 'users.readonly contacts.readonly contacts.write workflows.readonly locations/customFields.readonly locations/customFields.write',
        REDIRECT: {
            ASSOCIATE: 'http://localhost:3001/integrations/auth/agency',
        },
    },
};

// Set environment-specific API URLs
if (import.meta.env.MODE === Environment.STAGING) {
    env.API_URL = 'https://dev.api.walletcampaigns.com/api';
    env.GHL.REDIRECT.ASSOCIATE = 'https://dev.app.walletcampaigns.com/integrations/ghl/associate';
}

if (import.meta.env.MODE === Environment.PRODUCTION) {
       env.API_URL = 'https://dev.api.walletcampaigns.com/api';
    env.GHL.REDIRECT.ASSOCIATE = 'https://dev.app.walletcampaigns.com/integrations/ghl/associate';
}


export default env;
