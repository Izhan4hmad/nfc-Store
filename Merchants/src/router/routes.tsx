import { lazy } from 'react';
import { useUserInfo } from '../context/user';
const Integration = lazy(() => import('../layout/Integrations'));
const SuperAdmin = lazy(() => import('../layout/SuperAdmin'));
const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));

export default function useRoutes() {
    const { user } = useUserInfo();
    return [
        {
            path: '/*',
            layout: 'blank',
            element: <LoginBoxed />,
            guard: {
                valid: !user.email,
                redirect: `/admin/dashboard`,
            },
        },
        {
            path: '/integrations/*',
            element: <Integration />,
            layout: 'blank',
        },
        {
            path: '/admin/:userId/*',
            element: <SuperAdmin />,
            layout: 'super_admin',
            guard: {
                valid: user.email && user.role == 'super_admin',
                redirect: user.email && user.role == 'super_admin' ? `/admin/dashboard` : `/auth/sign-in`,
            },
        },
    ];
}
