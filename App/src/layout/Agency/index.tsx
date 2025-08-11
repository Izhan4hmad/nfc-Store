import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import useRoutes from './routes';
import Header from '../../components/Layouts/Header';

const index = () => {
    const routes = useRoutes();
    interface Route {
        path?: string;
        element?: React.ReactNode;
    }
    const getRoutes = (allRoutes: Route[]): React.ReactNode[] => {
        return allRoutes.map((route) => {
            if (route.path) {
                return <Route key={route.path} path={route.path} element={route.element} />;
            }

            return null;
        });
    };
    return (
        <>
            <Header routes={routes.filter((route) => route.title)} />
            <div className="p-8">
                <Routes>{getRoutes(routes)}</Routes>
            </div>
        </>
    );
};

export default index;
