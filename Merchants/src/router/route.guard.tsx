import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';

interface RouteGuardProps {
    valid: boolean;
    redirect: string;
    state?: any;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ valid, redirect, state }) => {
    const { location_id } = useParams();
    // console.log(redirect, 'redirect')
    return valid ? <Outlet /> : <Navigate replace to={redirect} state={state || { location_id }} />;
};

RouteGuard.defaultProps = {
    state: '',
};

export default RouteGuard;
