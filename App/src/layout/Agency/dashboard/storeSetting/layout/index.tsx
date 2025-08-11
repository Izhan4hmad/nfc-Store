import React from 'react';
import { useNavigate, useParams, useLocation, Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { settingsRoutes } from '../routes';

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, company_id, planId } = useParams();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate(`/app/${company_id}/${planId}/${userId}/agency-store`)} className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                                <ArrowLeft className="h-5 w-5" />
                                Back to Store
                            </button>
                            <div className="h-6 w-px bg-gray-300" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
                                <p className="text-gray-600">Manage your store configuration and products</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-64 flex-shrink-0 sticky self-start top-4 h-fit">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    {/* {React.createElement(settingsRoutes[0].icon, { className: "h-5 w-5" })} */}
                                    Settings Menu
                                </h3>
                            </div>
                            <nav className="p-2">
                                {settingsRoutes
                                    .filter((item) => item.name) 
                                    .map((item) => {
                                        const isActive = location.pathname.endsWith(item.path);
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`flex items-start gap-3 px-3 py-3 rounded-lg transition-colors ${
                                                    isActive ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            >
                                                <div className="min-w-0">
                                                    <div className={`font-medium ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>{item.name}</div>
                                                    <div className={`text-sm ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{item.description}</div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}