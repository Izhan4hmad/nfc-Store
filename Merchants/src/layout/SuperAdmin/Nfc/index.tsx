import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './routes';

export default function RewardRoutes() {
  interface RouteType {
    type?: string;
    key?: string;
    route?: string;
    component?: React.ReactNode;
    collapse?: RouteType[];
  }

  const getRoutes = (allRoutes: RouteType[]): React.ReactNode[] => {
    return allRoutes.flatMap((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse); // Recursively flatten nested routes
      }
      if (route.route && route.component) {
        return <Route path={route.route} element={route.component} key={route.key} />;
      }
      return [];
    });
  };

  return (
    <Routes>
      {getRoutes(routes)}
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
}
