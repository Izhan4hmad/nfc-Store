import { useAppServices } from 'hook/services';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useState } from 'react';

const DashboardStats = createContext();

const DashboardStatsProvider = ({ children }) => {
	const AppServices = useAppServices();
	const [waiting, setWaiting] = useState(false);
	const [statLoading, setStatLoading] = useState(false);
	const [appUsers, setAppUsers] = useState();
	const [appCompanies, setAppCompanies] = useState();
	const [appLocations, setAppLocations] = useState();
	const [appTickets, setAppTickets] = useState();
	const [topCompanies, setTopCompanies] = useState();
	const [marketplaceApps, setMarketplaceApps] = useState();

	const getDashboardStats = async (query) => {
		setStatLoading(true);
		const { response } = await AppServices.dashboard.get({
			query
		});
		if (response) {
			setAppUsers(response?.data?.app_users);
			setAppCompanies(response?.data?.app_companies);
			setAppLocations(response?.data?.app_locations);
			setAppTickets(response?.data?.app_tickets);
			setTopCompanies(response?.data?.top_companies)

			setStatLoading(false);
		}
	};

	const getApps = async () => {
		setWaiting(true);
		const { response, error } = await AppServices.app.superadmin_apps()

		if (response) {
			setMarketplaceApps(response);
			setWaiting(false);
		}
	}

	const onLoad = () => {
		// getDashboardStats('month');
		// getApps();
	};

	useEffect(onLoad, []);

	return (
		<DashboardStats.Provider value={{
			statLoading,
			setStatLoading,
			appUsers,
			appCompanies,
			appLocations,
			appTickets,
			topCompanies,
			marketplaceApps,
			waiting,
			setWaiting,
			handleRefresh: getDashboardStats
		}}>
			{children}
		</DashboardStats.Provider>
	);
};

function useDashboardStats() {
	return useContext(DashboardStats);
}

// Typechecking for props
DashboardStatsProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export { DashboardStatsProvider, useDashboardStats };
