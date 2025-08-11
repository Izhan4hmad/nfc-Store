const BASE_URL = 'https://rest.gohighlevel.com/v1';
const V2_BASE_URL = 'https://api.msgsndr.com';

const APIs = {
    oauth: `${V2_BASE_URL}/oauth/token`,
    v2: {
        location: (locationId: String) => `${V2_BASE_URL}/locations/${locationId}`,
        company: (companyId: String) => `${V2_BASE_URL}/companies/${companyId}`,
        custom_fields: (locationId: String) => `${V2_BASE_URL}/locations/${locationId}/customFields`,
        workflows: (locationId: String) => `${V2_BASE_URL}/workflows/?locationId=${locationId}`,
    },
    v1: {
        location: `${BASE_URL}/locations`,
        custom_fields: `${BASE_URL}/custom-fields/`,
        workflows: `${BASE_URL}/workflows/`,
    },
};

export { APIs };
