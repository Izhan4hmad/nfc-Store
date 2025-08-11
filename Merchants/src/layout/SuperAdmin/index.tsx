import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import useRoutes from './routes';
import SuperAdminSidebar from '../../components/Layouts/SuperAdminSidebar';

const index = () => {
    const routes = useRoutes();
    interface Route {
        path?: string;
        element?: React.ReactNode;
        items?: any[];
    }
    const getRoutes = (allRoutes: Route[]): React.ReactNode[] => {
        return allRoutes.map((route) => {
            if (route.items) {
                return getRoutes(route.items);
            }
            if (route.path) {
                return <Route key={route.path} path={route.path} element={route.element} />;
            }

            return null;
        });
    };
    return (
        <>
            <SuperAdminSidebar routes={routes} />
            <div className="p-8">
                <Routes>{getRoutes(routes)}</Routes>
            </div>
        </>
    );
};

export default index;
