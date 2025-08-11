import React, { PropsWithChildren, useEffect } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import useRoutes from './router/routes';
import RouteGuard from './router/route.guard';
import BlankLayout from './components/Layouts/BlankLayout';
import DefaultLayout from './components/Layouts/DefaultLayout';
function App({ children }: PropsWithChildren) {
    const routes = useRoutes();
    interface Route {
        guard?: {
            valid: boolean;
            redirect: string;
            state?: Record<string, any>;
        };
        path?: string;
        layout?: string;
        element?: React.ReactNode;
    }
    const getRoutes = (allRoutes: Route[]): React.ReactNode[] => {
        return allRoutes.map((route) => {
            if (route.guard) {
                const { valid, redirect, state } = route.guard;
                return (
                    <Route key={route.path} element={<RouteGuard valid={valid} redirect={redirect} state={state} />}>
                        <Route
                            path={route.path}
                            element={route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout layout={route.layout}>{route.element}</DefaultLayout>}
                        />
                    </Route>
                );
            }
            if (route.path) {
                return (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout layout={route.layout}>{route.element}</DefaultLayout>}
                    />
                );
            }

            return null;
        });
    };
    // useEffect(() => {}, [alert('work')]);

    return (
        <React.Fragment>
            <BrowserRouter>
                <Routes>
                    {/* <Route path="*" element={<Navigate to="/auth/sign-in" />} /> */}
                    {getRoutes(routes)}
                </Routes>
            </BrowserRouter>
        </React.Fragment>
    );
}

export default App;
