import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QueryString from 'qs';
import { useAppServices } from '../../../hook/services';
import { ReqMethods, ghl } from '../../../enums';
import env from '../../../config';
import { useUserInfo } from '../../../context/user';

function GHL() {
    const { user } = useUserInfo();
    const navigate = useNavigate();
    const { search } = useLocation();
    const code = new URLSearchParams(search).get('code');
    const AppServices = useAppServices();
    const [Error, setError] = useState('');
    // const user_id = new URLSearchParams(search).get('state');

    const associate = async (creds: any, company: any) => {
        // console.log(creds, 'creds');
        // console.log(company, 'company');
        const payload = { ...creds, user_id: user.id, company: company };
        var { response } = await AppServices.access_token.create({ payload });

        if (!response) return setError('Something went wrong while integration, please try latter');

        return window.open('https://crmdashboard.fixmyonline.com/app/subaccount_sim', '_self');
    };
    const getCompany = async (creds: any) => {
        const payload = {
            method: ReqMethods.GET,
            path: ghl.APIs.v2.company(creds.companyId),
            headers: {
                Authorization: `Bearer ${creds.access_token}`,
                Version: '2021-07-28',
                Accept: 'application/json',
            },
        };
        const { response } = await AppServices.services.ghl.call_service({ payload });

        if (!response) return setError('Something went wrong while getting company, please try latter');

        return response && associate(creds, response.data.company);
    };
    let pageLoad = true;
    const getCreds = async () => {
        const payload = {
            method: ReqMethods.POST,
            path: ghl.APIs.oauth,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            payload: QueryString.stringify({
                client_id: env.GHL.CLIENT_ID,
                client_secret: env.GHL.CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                refresh_token: '',
            }),
        };
        //
        const { response } = await AppServices.services.ghl.call_service({ payload });

        if (!response) return setError('Something went wrong while integration, please try latter');

        return response && getCompany(response.data);
    };

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
