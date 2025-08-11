import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QueryString from "qs";
import { ReqMethods, ghl } from "../../../enums";
import env from "../../../config";
import { useAppServices } from "../../../hook/services";
const index = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const code = new URLSearchParams(search).get("code");
    const type = new URLSearchParams(search).get("type");
    const state = new URLSearchParams(search).get("state");
    const AppServices = useAppServices();
    const [Error, setError] = useState("");
    const associate = async (creds: any) => {
        const payload = {
            location_id: creds.locationId,
            company_id: creds.companyId,
            access_token: creds.access_token,
            refresh_token: creds.refresh_token,
            app_id: state?.split(',')[2],
        }
        console.log(payload, 'payload')
        // const { response } = await AppServices.app_token.free_app_access_token({ payload })
        // if (response) {
        // }

        // if (!response) return setError("Something went wrong while integration, please try latter");
        // update(payload);
        return setError("Location Connected Successfully");
    };

    const getLocation = async (creds: any) => {
        const payload = {
            method: ReqMethods.GET,
            path: `${ghl.APIs.v2.location(creds.locationId)}`,
            key: creds.access_token,
            refresh_token: creds.refresh_token,
        };
        // console.log(payload)
        const { response } = await AppServices.services.ghl.call_service({ payload });

        if (!response) return setError("Something went wrong while integration, please try latter");
        // console.log(response.data)

        // return response && await associate(response.data, creds)
        return setError("Location Connected Successfully");
    };

    const getCreds = async () => {
        const payload = {
            method: ReqMethods.POST,
            path: ghl.APIs.oauth,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            payload: QueryString.stringify({
                client_id: state?.split(',')[0],
                client_secret: state?.split(',')[1],
                grant_type: "authorization_code",
                code,
                refresh_token: "",
            }),
        };
        // console.log(payload)
        const { response } = await AppServices.services.ghl.call_service({ payload });
        console.log(response, 'responseresponse')
        // return setError("Location Connected Successfully");

        if (!response) return setError("Something went wrong while integration, please try latter");
        return response && associate(response.data);
    };

    const onLoad = () => {
        // alert('test')
        getCreds();
    };

    useEffect(onLoad, []);

    return (
        <div className="p-3">
            {!Error && <div className="text-white">Integrating please wait...</div>}
            {Error && (
                <div className="flex gap-1">
                    {Error}
                    {/* <button className="btn btn-primary btn-sm" onClick={() => navigate(-2)}>Go Back</button> */}
                </div>
            )}
        </div>
    );
}

export default index;
