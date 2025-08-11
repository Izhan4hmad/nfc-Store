import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layout';
import { settingsRoutes } from './routes';

export default function StoreSetting() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Navigate to="create-product" replace />} />
                {settingsRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.component} />
                    ))}
            </Route>
        </Routes>
    );
}
