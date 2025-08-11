import React, { useEffect, useState } from 'react';
import ssoHandler from './ssoHandler';
import Loader from '../../components/Loader';
const iframeStyles = {
    width: '100%',
    height: '100vh',
    border: 'none',
};
const Index = () => {
    const { SSO, checkSSO } = ssoHandler();
    const [ssodata, setssodata] = useState<any>({});
    const [loader, setloader] = useState(true);
    useEffect(() => {
        checkSSO();
    }, []);
    useEffect(() => {
        if (SSO != '' && SSO != undefined) {
            var data = JSON.parse(SSO);
            setssodata(data);
            setloader(false);
        }
    }, [SSO]);
    return (
        <div>
            {loader ? (
                <Loader />
            ) : (
                <>
                    {ssodata?.activeLocation ? (
                        <iframe style={iframeStyles} src={`http://localhost:3001/${ssodata.email}/${ssodata?.activeLocation}/app/dashboard`}></iframe>
                    ) : (
                        <div>Comming Soon....</div>
                    )}
                </>
            )}
        </div>
    );
};

export default Index;
