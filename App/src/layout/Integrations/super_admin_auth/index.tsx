import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QueryString from 'qs';
import { useAppServices } from '../../../hook/services';
import { ReqMethods, ghl } from '../../../enums';
import env from '../../../config';
function GHL() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const code = new URLSearchParams(search).get('code');
    const AppServices = useAppServices();
    const [Error, setError] = useState('');
    // const user_id = new URLSearchParams(search).get('state');

    const associate = async (creds: any) => {
        const data = { access_token: creds.access_token, refresh_token: creds.refresh_token, location_id: creds.locationId, company_id: creds.companyId };
        const payload = {
            location_connection: JSON.stringify(data),
        };
        var { response } = await AppServices.admin_settings.create({ payload });

        if (!response) return setError('Something went wrong while integration, please try latter');

        return navigate(-2);
    };
    // const getLocation = async (creds: any) => {
    //     console.log('getLocation');
    //     const payload = {
    //         method: ReqMethods.GET,
    //         path: ghl.APIs.v2.location(creds.locationId),
    //         headers: {
    //             Authorization: `Bearer ${creds.access_token}`,
    //             Version: '2021-07-28',
    //             Accept: 'application/json',
    //         },
    //     };
    //     const { response } = await AppServices.services.ghl.call_service({ payload });

    //     if (!response) return setError('Something went wrong while getting company, please try latter');

    //     return response && associate(creds, response.data.location);
    // };
    const getCreds = async () => {
        const payload = {
            method: ReqMethods.POST,
            path: ghl.APIs.oauth,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            payload: QueryString.stringify({
                client_id: env.GHL.SUPER_ADMIN_CLIENT_ID,
                client_secret: env.GHL.SUPER_ADMIN_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                refresh_token: '',
            }),
        };
        //
        const { response } = await AppServices.services.ghl.call_service({ payload });

        if (!response) return setError('Something went wrong while integration, please try latter');

        return response && associate(response.data);
    };

    let pageLoad = true;
    const onLoad = () => {
        if (pageLoad) {
            getCreds();
            pageLoad = false;
        }
    };

    useEffect(onLoad, []);

    return (
        <div>
            {!Error && <div>Integrating please wait...</div>}
            {Error && (
                <div>
                    {Error}
                    {/* <SoftButton onClick={() => navigate(-2)}>Go Back</SoftButton> */}
                </div>
            )}
        </div>
    );
}

export default GHL;
