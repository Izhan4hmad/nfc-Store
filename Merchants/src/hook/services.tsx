import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import React from 'react';
import { ReqMethods, ResponseStatus } from '../enums';
import env from '../config';
// import { setNotification, useNotifcation } from "context/notification";
import { useAuth, useLogout } from './auth';

const BASE_URL = `${env.API_URL}/api/v1`;
const UNSECURE_BASE_URL = `${env.API_URL}`;

type RequestOptions = {
    query?: any | string;
    payload?: any;
    method?: any;
    token?: boolean;
    apiKey?: string | null;
    message?: string;
    error?: string;
};
function useServiceHandler() {
    // const [, dispatch] = useNotifcation();
    const Logout = useLogout();
    return (fn: (method: string, path: string, config: AxiosRequestConfig | RequestOptions) => Promise<any>) =>
        async (method: string, path: string, { query, payload, token, apiKey, message, error }: RequestOptions = {}) => {
            try {
                const res = await fn(method, path, { query, payload, token, apiKey });
                // console.log('API - RESPONSE', res, message, error);
                // toaster &&
                //   setNotification(dispatch, {
                //     open: true,
                //     message: message || res.data.message,
                //     title: "Success",
                //   });

                return { response: res.data };
            } catch (err: any) {
                // console.log('API- ERROR', err.response?.data || err);

                // expire error : jwt expired
                if (err.response && err.response.status === ResponseStatus.UNAUTHORIZED) {
                    // setNotification(dispatch, {
                    //   open: true,
                    //   message: error || "session expired",
                    //   title: "Error",
                    //   severity: "error",
                    // });
                    setTimeout(Logout, 4000);
                    return { error: err.response?.data || err };
                }

                return { error: err.response ? err.response.data : err };
            }
        };
}

function useCallService() {
    const authToken = useAuth();
    const serviceHandler = useServiceHandler();

    const CallService = (method: string | any, path: string, { query, payload, token = true, apiKey = null }: RequestOptions | any) => {
        const pathname = query ? `${path}?${query}` : path;

        const config: AxiosRequestConfig = {};
        if (token) config.headers = { 'x-auth-token': `Bearer ${authToken || token}` };
        if (apiKey) config.headers = { apiKey };
        type DetailsOptions = {
            payload?: any;
            config?: any;
        };
        const details: DetailsOptions = {};

        if (payload) details.payload = payload;
        details.config = config;

        return (axios as any)[method](pathname, ...Object.values(details));
    };

    return serviceHandler(CallService);
}

function useAppServices() {
    const { GET, POST, PUT, DELETE } = ReqMethods;
    const serviceHandler = useCallService();

    /**
     * Option for service is the object that could have the following properties
     * query, payload, token, apiKey
     */

    const APIs = {
        access_token: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/access_token`, options),
            create: (options: any) => serviceHandler(POST, `${BASE_URL}/access_token`, options),
            locationtoken: (options: any) => serviceHandler(POST, `${BASE_URL}/access_token/locationtoken`, options),
        },
        dashboard: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/dashboard`, options),
        },
        stripe: {
            get_customer_payment_methods: (options: any) => serviceHandler(GET, `${BASE_URL}/stripe/get_customer_payment_methods`, options),
        },
        admin_settings: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/admin_settings`, options),
            create: (options: any) => serviceHandler(POST, `${BASE_URL}/admin_settings`, options),
        },
        plans: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/plans`, options),
            get_with_stripe_plans: (options: any) => serviceHandler(GET, `${BASE_URL}/plans/get_with_stripe_plans`, options),
            create: (options: any) => serviceHandler(POST, `${BASE_URL}/plans`, options),
            delete: (options: any) => serviceHandler(DELETE, `${BASE_URL}/plans`, options),
        },
        user_settings: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/user_settings`, options),
            create: (options: any) => serviceHandler(POST, `${BASE_URL}/user_settings`, options),
        },

        auth: {
            login: (options: any) => serviceHandler(POST, `${BASE_URL}/auth/login`, options),
            verify_otp: (options: any) => serviceHandler(POST, `${BASE_URL}/auth/verify_otp`, options),
        },
        user: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/user`, options),
            filter: (options: any) => serviceHandler(GET, `${BASE_URL}/user/filter`, options),
            get_users_with_plans: (options: any) => serviceHandler(GET, `${BASE_URL}/user/get_users_with_plans`, options),
            create_user_from_super_admin: (options: any) => serviceHandler(POST, `${BASE_URL}/user/create_user_from_super_admin`, options),
            update_password: (options: any) => serviceHandler(PUT, `${BASE_URL}/user/update_password`, options),
            create: (options: any) => serviceHandler(POST, `${BASE_URL}/user`, options),
            forgot_password: (options: any) => serviceHandler(POST, `${BASE_URL}/user/forgot_password`, options),
            upgrade_plan: (options: any) => serviceHandler(POST, `${BASE_URL}/user/upgrade_plan`, options),
        },
        ghl_locations: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/ghl_locations`, options),
            update: (options: any) => serviceHandler(PUT, `${BASE_URL}/ghl_locations`, options),
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
        utils: {
            upload_image: (options: any) => serviceHandler(POST, `${BASE_URL}/utils/upload/image`, options),
        },

        nfcbusinessCard: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/nfcbusiness/`, options),
            getByUserId: (options: any) => serviceHandler(GET, `${BASE_URL}/nfcbusiness/get_by_user_id`, options),
            getbycardId: (options: any) => serviceHandler(GET, `${BASE_URL}/nfcbusiness/getcardinfo`, options),
            GetById: (options: any) => serviceHandler(GET, `${BASE_URL}/nfcbusiness/getById`, options),
            update: (options: any) => serviceHandler(PUT, `${BASE_URL}/nfcbusiness/update`, options),
            create: (options: any) => serviceHandler(POST, `${BASE_URL}/nfcbusiness/create`, options),
            // delete: (options: any) => serviceHandler(DELETE, `${BASE_URL}/pages`, options),
            // filter: (options: any) => serviceHandler(GET, `${BASE_URL}/pages/filter`, options),
        },
        productsPage: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/productsPage/`, options),
            GetProductByMerchantId: (options: any) => serviceHandler(GET, `${BASE_URL}/productsPage/GetProductByMerchantId`, options),
            GetByProductId: (options: any) => serviceHandler(GET, `${BASE_URL}/productsPage/GetByProductId`, options),
            update: (options: any) => serviceHandler(PUT, `${BASE_URL}/productsPage/`, options),
            create: (options: any) => serviceHandler(POST, `${BASE_URL}/productsPage/create`, options),
            delete: (options: any) => serviceHandler(POST, `${BASE_URL}/productsPage/`, options),
            // filter: (options : any) => serviceHandler(GET, `${BASE_URL}/pages/filter`, options),
        },
        packages: {
            get: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc_package/`, options),
            GetByBundleId: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc_package/GetByBundleId`, options),
            GetBundleByMerchantId: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc_package/GetBundleByMerchantId`, options),
            update: (options: any) => serviceHandler(PUT, `${BASE_URL}/nfc_package/`, options),
            create: (options: any) => serviceHandler(POST, `${BASE_URL}/nfc_package/`, options),
            delete: (options: any) => serviceHandler(DELETE, `${BASE_URL}/nfc_package`, options),
            getOrder: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc_package/get_order`, options),
            getOrderDetails: (options: any) => serviceHandler(GET, `${BASE_URL}/nfc_package/get_order_details`, options),
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
