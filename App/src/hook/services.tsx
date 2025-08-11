import axios, { AxiosRequestConfig } from 'axios';
import { ReqMethods, ResponseStatus } from '../enums';
import env from '../config';
import { useParams } from 'react-router-dom';
// import { setNotification, useNotifcation } from "context/notification";
// import { useAuth, useLogout } from "../hook/auth";

const BASE_URL = `${env.API_URL}/api/v1`;
const BASE_URL_NFC = `${env.API_URL}/api/agency_app`;
const APPS_BASE_URL = `${env.API_URL}/v1`;
const AGENCY_APPS_BASE_URL = `${env.API_URL}/api/agency_app`;

type RequestOptions = {
    query?: string;
    payload?: any;
    token?: boolean;
    apiKey?: string | null;
    message?: string;
    error?: string;
};
function useServiceHandler() {
    return (fn: (method: string, path: string, config: AxiosRequestConfig | any) => Promise<any>) =>
        async (method: string, path: string, { query, payload, token, apiKey, message, error }: RequestOptions = {}) => {
            try {
                const res = await fn(method, path, { query, payload, token, apiKey });
                console.log('API - RESPONSE', res, message, error);

                return { response: res.data };
            } catch (err: any) {
                console.log('API- ERROR', err.response?.data || err);

                if (err.response && err.response.status === ResponseStatus.UNAUTHORIZED) {
                    return { error: err.response?.data || err };
                }

                return { error: err.response ? err.response.data : err };
            }
        };
}

function useCallService() {
    const serviceHandler = useServiceHandler();

    const CallService = (method: string, path: string, { query, payload, token = true, apiKey = null }: RequestOptions = {}) => {
        const pathname = query ? `${path}?${query}` : path;

        const config: AxiosRequestConfig = {}; // Correct type

        if (apiKey) config.headers = { apiKey };

        const details = {
            ...(payload ? { data: payload } : {}), // Use 'data' for payload in Axios
            ...config,
        };

        return axios({
            // Use axios as a function
            method,
            url: pathname,
            ...details,
        });
    };

    return serviceHandler(CallService);
}

function useAppServices() {
    const { company_id } = useParams<{ company_id: string }>();

    const { GET, POST, PUT, DELETE } = ReqMethods;
    const serviceHandler = useCallService();

    /**
     * Option for service is the object that could have the following properties
     * query, payload, token, apiKey
     */

    const APIs = {
        auth: {
            login: (options: any) => serviceHandler(POST, `${BASE_URL}/auth/login`, options),
            signup: (options: any) => serviceHandler(POST, `${BASE_URL}/auth/signup`, options),
            access_token: (options: any) => serviceHandler(POST, `${APPS_BASE_URL}/auth/access_token`, options),
            verify_otp: (options: any) => serviceHandler(POST, `${APPS_BASE_URL}/auth/access_token`, options),
        },

        access_token: {
            create: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/servey/GetFormBuilderNameAndUrl`, options),
        },
        admin_settings: {
            create: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/admin_settings/`, options),
        },
        servey: {
            get: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/servey/GetFormBuilderNameAndUrl`, options),
        },
        message: {
            get: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/message`, options),
        },
        subaccounts: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/subaccount_dashboard`, options),
        },
        agency_instructions: {
            get: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/agency_instructions`, options),
            get_assisstant: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/agency_instructions/get-assisstant`, options),
            create: (options: any) => serviceHandler(POST, `${AGENCY_APPS_BASE_URL}/agency_instructions/create`, options),
            update: (options: any) => serviceHandler(PUT, `${AGENCY_APPS_BASE_URL}/agency_instructions/update`, options),
        },

        location_instructions: {
            get: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/location_instructions`, options),
            create: (options: any) => serviceHandler(POST, `${AGENCY_APPS_BASE_URL}/location_instructions/create`, options),
            update: (options: any) => serviceHandler(PUT, `${AGENCY_APPS_BASE_URL}/location_instructions/update`, options),
        },
        app: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/app`, options),
            get_free_app: (options: any) => serviceHandler(GET, `${BASE_URL}/app/free_app`, options),
            update: (options: any) => serviceHandler(PUT, `${BASE_URL}/app`, options),
            create: (options: any) => serviceHandler(POST, `${BASE_URL}/app`, options),
            delete: (options: any) => serviceHandler(DELETE, `${BASE_URL}/app`, options),
            filter: (options: any) => serviceHandler(GET, `${BASE_URL}/app/filter`, options),
            EnableWebIntegrationLocation: (options: any) => serviceHandler(POST, `${BASE_URL}/app/enable_web_integration_location`, options),
            EnableWebIntegrationLocationBulk: (options: any) => serviceHandler(POST, `${BASE_URL}/app/enable_web_integration_location_bulk`, options),

            get_location: (options: any) => serviceHandler(GET, `${BASE_URL}/app/get-locations`, options),
            GetWebIntegrationLocations: (options: any) => serviceHandler(GET, `${BASE_URL}/app/get-web-integrations`, options),

            get_app_for_install_page: (options: any) => serviceHandler(GET, `${BASE_URL}/app/get_app_for_install_page`, options),
            filterApps: (options: any) => serviceHandler(GET, `${BASE_URL}/app/filterApps`, options),
            connection_data: (options: any) => serviceHandler(GET, `${BASE_URL}/app/connection_data`, options),
            get_install_apps: (options: any) => serviceHandler(GET, `${BASE_URL}/app/get_install_apps`, options),
            get_single_app: (options: any) => serviceHandler(GET, `${BASE_URL}/app/get_single_app`, options),
            get_premiume_apps: (options: any) => serviceHandler(GET, `${BASE_URL}/app/get_premiume_apps`, options),
            get_app_with_token: (options: any) => serviceHandler(GET, `${BASE_URL}/app/get_app_with_token`, options),
            get_agency_install_apps: (options: any) => serviceHandler(GET, `${BASE_URL}/app/get_agency_install_apps`, options),
            get_agency_install_apps_by_domain: (options: any) => serviceHandler(GET, `${BASE_URL}/app/get_agency_install_apps_by_domain`, options),
            default_apps: (options: any) => serviceHandler(GET, `${BASE_URL}/app/default_apps`, options),
            get_search_apps: (options: any) => serviceHandler(GET, `${BASE_URL}/app/get_search_apps`, options),
            get_company_with_alltheapps_token: (options: any) => serviceHandler(GET, `${BASE_URL}/app/get_company_with_alltheapps_token`, options),
            awarded_companies: (options: any) => serviceHandler(GET, `${BASE_URL}/app/awarded_companies`, options),
            update_app_with_company_id: (options: any) => serviceHandler(POST, `${BASE_URL}/app/update_app_with_company_id`, options),

            update_app_with_company_id_location_id: (options: any) => serviceHandler(POST, `${BASE_URL}/app/update_app_with_company_id_location_id`, options),

            get_app_by_company_id_and_app_id: (options: any) => serviceHandler(GET, `${BASE_URL}/app/get_app_by_company_id_and_app_id`, options),
            getCompaniesDetails: (options: any) => serviceHandler(GET, `${BASE_URL}/app/getCompaniesDetails`, options),
        },

        nfc: {
            create: (options: any) => serviceHandler(POST, `${BASE_URL}/nfc`, options),
            creategroups: (options: any) => serviceHandler(POST, `${BASE_URL}/nfcbusiness/createNfcGroups`, options),
            unlimited_data: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc/unlimited_data`, options),
            filter: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc/filter`, options),
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc`, options),
            getnfcgroupcodes: (options: any) => serviceHandler(GET, `${BASE_URL}/nfcbusiness/getnfcgroups`, options),
            GetOne: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc/get-one`, options),
            AssociatebyAgency: (options: any) => serviceHandler(PUT, `${BASE_URL}/nfcbusiness/associatebyagency`, options),
            getAssociatebyAgency: (options: any) => serviceHandler(GET, `${BASE_URL}/nfcbusiness/getbyagency`, options),
            updateurl: (options: any) => serviceHandler(PUT, `${BASE_URL}/nfcbusiness/update`, options),
            getByAssociateId: (options: any) => serviceHandler(GET, `${BASE_URL}/nfcbusiness/associateIdproduct`, options),
            getPackages: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc_package`, options),

            update: (options: any) => serviceHandler(PUT, `${BASE_URL}/nfc`, options),
            delete: (options: any) => serviceHandler(DELETE, `${BASE_URL}/nfc`, options),
            get_faqs: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc/get_faqs`, options),
        },

        nfc_bundle: {
            get_product_details: (options: any) => serviceHandler(GET, `${BASE_URL_NFC}/nfc_bundle/product_details`, options),
            get_coupons: (options: any) => serviceHandler(GET, `${BASE_URL_NFC}/nfc_bundle/coupon_details`, options),
            get_tags: (options: any) => serviceHandler(GET, `${BASE_URL_NFC}/nfc_bundle/tags_details`, options),
            update_redeem_coupon: (options: any) => serviceHandler(PUT, `${BASE_URL_NFC}/nfc_bundle/redeem_coupon`, options),
        },

        app_token: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/app_token`, options),
            update: (options: any) => serviceHandler(PUT, `${BASE_URL}/app_token`, options),
            create: (options: any) => serviceHandler(POST, `${BASE_URL}/app_token`, options),
            delete: (options: any) => serviceHandler(DELETE, `${BASE_URL}/app_token`, options),
            filter: (options: any) => serviceHandler(GET, `${BASE_URL}/app_token/filter`, options),
            save_credentials: (options: any) => serviceHandler(POST, `${BASE_URL}/app_token/save_credentials`, options),
            CheckApiKey: (options: any) => serviceHandler(POST, `${BASE_URL}/app_token/CheckApiKey`, options),
            check_api_key_from_ui: (options: any) => serviceHandler(POST, `${BASE_URL}/app_token/check_api_key_from_ui`, options),
            free_app_access_token: (options: any) => serviceHandler(POST, `${BASE_URL}/app_token/free_app_access_token`, options),
            re_install_app: (options: any) => serviceHandler(POST, `${BASE_URL}/app_token/re_install_app`, options),
            validate_api: (options: any) => serviceHandler(POST, `${BASE_URL}/app_token/validate/api-key`, options),
            whitelable: (options: any) => serviceHandler(PUT, `${BASE_URL}/app_token/whitelabel-config`, options),
            whitelabledomainsetting: (options: any) => serviceHandler(POST, `${BASE_URL}/app_token/whitelabledomainsetting`, options),

            get_location_data_by_id: (options: any) => serviceHandler(GET, `${BASE_URL}/app_token/get_location_data_by_id`, options),
            search_contact_by_location_data: (options: any) => serviceHandler(POST, `${BASE_URL}/app_token/search_contact_by_location_data`, options),
        },
        prospect: {
            getlocations: (options: any) => serviceHandler(GET, `${BASE_URL}/prospect/getlocations`, options),
            GetUsers: (options: any) => serviceHandler(GET, `${BASE_URL}/prospect/getUsers`, options),
            get_single_location: (options: any) => serviceHandler(GET, `${BASE_URL}/prospect/get_single_location`, options),
            update_location: (options: any) => serviceHandler(PUT, `${BASE_URL}/prospect/update_location`, options),
            enable_billing: (options: any) => serviceHandler(POST, `${BASE_URL}/prospect/enable_billing`, options),
        },
        user: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/user`, options),
            create: (options: any) => serviceHandler(GET, `${BASE_URL}/user`, options),
            filter: (options: any) => serviceHandler(GET, `${BASE_URL}/user/filter`, options),
            register: (options: any) => serviceHandler(POST, `${BASE_URL}/user/register`, options),
            forgot_password: (options: any) => serviceHandler(POST, `${BASE_URL}/user/register`, options),
            add_team: (options: any) => serviceHandler(POST, `${BASE_URL}/user/add_team `, options),
            location_user: (options: any) => serviceHandler(GET, `${BASE_URL}/user/location_user`, options),
            subscriber: (options: any) => serviceHandler(GET, `${BASE_URL}/user/subscriber`, options),
            agency_user: (options: any) => serviceHandler(GET, `${BASE_URL}/user/agency_user`, options),
            user_info: (options: any) => serviceHandler(GET, `${BASE_URL}/user/user_info`, options),
            all_app_users: (options: any) => serviceHandler(GET, `${BASE_URL}/appusers/allappusers`, options),
        },

        agency: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/agency`, options),
            get_ghl_company: (options: any) => serviceHandler(GET, `${BASE_URL}/agency/get_ghl_company`, options),
            update_ghl_company: (options: any) => serviceHandler(PUT, `${BASE_URL}/agency/update_ghl_company`, options),
            getProfile: (options: any) => serviceHandler(GET, `${BASE_URL}/agency/profile`, options),
            profile: (options: any) => serviceHandler(POST, `${BASE_URL}/agency/profile`, options),
            get_app_setup: (options: any) => serviceHandler(GET, `${BASE_URL}/agency/get_app_setup`, options),
            getworkflows: (options: any) => serviceHandler(GET, `${BASE_URL}/agency/getworkflows`, options),
            update: (options: any) => serviceHandler(PUT, `${BASE_URL}/agency`, options),
            update_with_company_id: (options: any) => serviceHandler(PUT, `${AGENCY_APPS_BASE_URL}/agency/update_with_company_id`, options),
            getProducts: (options: any) => serviceHandler(GET, `${BASE_URL}/agency/getproducts`, options),
            getSnapshots: (options: any) => serviceHandler(GET, `${BASE_URL}/agency/list-snapshots`, options),
        },
        utils: {
            upload_image: (options: any) => serviceHandler(POST, `${BASE_URL}/utils/upload/image`, options),
        },
        services: {
            ghl: {
                call_service: (options: any) => serviceHandler(POST, `${BASE_URL}/services/ghl/`, options),
            },
        },
        ghl: {
            call: (options: any) => serviceHandler(POST, `${BASE_URL}/services/ghl`, options),
            refresh_token: (options: any) => serviceHandler(POST, `${BASE_URL}/services/ghl/refresh_token`, options),
        },
        webhook: {
            saveSSOData: (options: any) => serviceHandler(POST, `${BASE_URL}/webhook/sso`, options),
            get_all_feedbacks: (options: any) => serviceHandler(GET, `${BASE_URL}/webhook/get_all_feedbacks`, options),
        },
        alltheAppsmenuEdit: {
            get: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/alltheAppsmenuEdit`, options),
            update: (options: any) => serviceHandler(PUT, `${AGENCY_APPS_BASE_URL}/alltheAppsmenuEdit/update`, options),
            create: (options: any) => serviceHandler(POST, `${AGENCY_APPS_BASE_URL}/alltheAppsmenuEdit/create`, options),
            delete: (options: any) => serviceHandler(DELETE, `${AGENCY_APPS_BASE_URL}/alltheAppsmenuEdit/delete`, options),
            filter: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/alltheAppsmenuEdit/filter`, options),
        },
        brandsBoardCustomization: {
            get: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/brandsBoardCustomization`, options),
            update: (options: any) => serviceHandler(PUT, `${AGENCY_APPS_BASE_URL}/brandsBoardCustomization/update`, options),
            create: (options: any) => serviceHandler(POST, `${AGENCY_APPS_BASE_URL}/brandsBoardCustomization/create`, options),
            delete: (options: any) => serviceHandler(DELETE, `${AGENCY_APPS_BASE_URL}/brandsBoardCustomization/delete`, options),
            filter: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/brandsBoardCustomization/filter`, options),
        },
        allTheAppsGroups: {
            get: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/alltheappsgroups`, options),
            update: (options: any) => serviceHandler(PUT, `${AGENCY_APPS_BASE_URL}/alltheappsgroups/update`, options),
            create: (options: any) => serviceHandler(POST, `${AGENCY_APPS_BASE_URL}/alltheappsgroups/create`, options),
            delete: (options: any) => serviceHandler(DELETE, `${AGENCY_APPS_BASE_URL}/alltheappsgroups/delete`, options),
            filter: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/alltheappsgroups/filter`, options),
        },
        CustomizerCustomLevel: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/CustomizerCustomLevel`, options),
            update: (options: any) => serviceHandler(PUT, `${BASE_URL}/CustomizerCustomLevel/update`, options),
            create: (options: any) => serviceHandler(POST, `${BASE_URL}/CustomizerCustomLevel/create`, options),
            delete: (options: any) => serviceHandler(DELETE, `${BASE_URL}/CustomizerCustomLevel/delete`, options),
            filter: (options: any) => serviceHandler(GET, `${BASE_URL}/CustomizerCustomLevel/filter`, options),
        },
        SettingMenuCustomization: {
            get: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/SettingMenuCustomization/get`, options),
            update: (options: any) => serviceHandler(PUT, `${AGENCY_APPS_BASE_URL}/SettingMenuCustomization/update`, options),
            create: (options: any) => serviceHandler(POST, `${AGENCY_APPS_BASE_URL}/SettingMenuCustomization/create`, options),
            delete: (options: any) => serviceHandler(DELETE, `${AGENCY_APPS_BASE_URL}/SettingMenuCustomization/delete`, options),
            filter: (options: any) => serviceHandler(GET, `${AGENCY_APPS_BASE_URL}/SettingMenuCustomization/filter`, options),
        },
        productsPage: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/productsPage/`, options),
            GetProductByMerchantId: (options: any) => serviceHandler(GET, `${BASE_URL}/productsPage/GetProductByMerchantId`, options),
            GetByProductId: (options: any) => serviceHandler(GET, `${BASE_URL}/productsPage/GetByProductId`, options),
            GetProductByCompanyId: (options: any) => serviceHandler(GET, `${BASE_URL}/productsPage/GetProductByCompanyId`, options),
            GetByAgencyCreatedVariants: (options: any) => serviceHandler(GET, `${BASE_URL}/productsPage/GetByAgencyCreatedVariants`, options),
            RemoveProductFromStore: (options: any) => serviceHandler(PUT, `${BASE_URL}/productsPage/RemoveProductFromStore`, options),
            update: (options: any) => serviceHandler(PUT, `${BASE_URL}/productsPage/`, options),
            create: (options: any) => serviceHandler(POST, `${BASE_URL}/productsPage/create`, options),
            delete: (options: any) => serviceHandler(POST, `${BASE_URL}/productsPage/`, options),
            // filter: (options : any) => serviceHandler(GET, `${BASE_URL}/pages/filter`, options),
        },
        packages: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc_package/`, options),
            GetByBundleId: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc_package/GetByBundleId`, options),
            GetBundleByMerchantId: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc_package/GetBundleByMerchantId`, options),
            GetBundleByCompanyId: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc_package/GetBundleByCompanyId`, options),
            RemoveBundleFromStore: (options: any) => serviceHandler(PUT, `${BASE_URL}/nfc_package/RemoveBundleFromStore`, options),
            update: (options: any) => serviceHandler(PUT, `${BASE_URL}/nfc_package/`, options),
            create: (options: any) => serviceHandler(POST, `${BASE_URL}/nfc_package/`, options),
            delete: (options: any) => serviceHandler(DELETE, `${BASE_URL}/nfc_package`, options),
            getOrder: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc_package/get_order`, options),
            getOrderDetails: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc_package/get_order_details`, options),
        },
        nfc_users: {
            GetMerchants: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc_users/GetMerchants`, options),
            GetById: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc_users/GetById`, options),
        },
    };

    return APIs;
}

const useUploadImage = () => {
    const AppService = useAppServices();
    return ({ toaster, file, desiredPath }: { toaster: any; file: any; desiredPath: string }) => {
        const form = new FormData();
        form.append('image', file, file.name);
        return AppService.utils.upload_image({
            toaster,
            payload: form,
            query: `desiredPath=${desiredPath}`,
        });
    };
};

export { useAppServices, useCallService, useUploadImage };
