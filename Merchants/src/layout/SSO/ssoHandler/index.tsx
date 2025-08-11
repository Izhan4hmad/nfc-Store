// import Item from "antd/lib/list/Item";
// import { useAgencyInfo } from "context/agency";
// import { useAppServices } from "hook/services";
// import React from "react";
import { useEffect, useState } from 'react';
// import { useState } from "react";
import crypto from 'crypto-js';
// import 'crypto-js/addon/pad-iso10126';
// import 'crypto-js/enc-utf8';

const SsoHandler = () => {
    const [ssodata, setssodata] = useState('');
    const decript_data = async (payload: any, app: any) => {
        let ciphertext = await crypto.AES.decrypt(payload, app.key).toString(crypto.enc.Utf8);
        console.log(ciphertext);
        setssodata(ciphertext);
    };
    const checkSSO = () => {
        const key = new Promise((resolve) => {
            const sso = {
                app_id: '6784d282738eb2a4c74b1a17',
                key: '10ec509b-9e3e-4134-93c5-3957f56e157d',
            };

            //   decript_data(
            //     "U2FsdGVkX19VqIamqITisev3GuIqKPG3wqJ1A3Dgk7n90fWOoXgwOya5+L0eTYHsWzSNQpmQhysbm48bb8pCfOBd3xONisufnyMCfanp2ZFL/J43OQ+JI4r29VRwiBm4KP79Se8/IiCBbT89f/AboOSbVK9TP8SVFP3f6HYdgnrulP4KITIRWnfCrRPF98hfNRKwrpi4MYEexX4EDsFvrBjW8w/uG4srWFg/5wHV7J1YEMI0BROVKkM1GdAWR9TGV05c8BqTclnoU4iS/CupMDia/iN5As1ADXULX8J0j+0=",
            //     sso
            //   );

            window.parent.postMessage({ message: 'REQUEST_USER_DATA' }, '*');
            const temp = window.addEventListener('message', ({ data }) => {
                if (data.message === 'REQUEST_USER_DATA_RESPONSE') {
                    console.log(data.payload, sso, 'sso');
                    decript_data(data.payload, sso);
                } else {
                }
                // console.log(temp, 'temptemptemptemptemptemp')
            });
        });
    };
    return {
        SSO: ssodata,
        checkSSO: checkSSO,
    };
};
export default SsoHandler;
