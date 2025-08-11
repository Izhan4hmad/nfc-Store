/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/**
  This file is used for controlling the global states of the components,
  you can customize the states for the different components here.
*/

import { createContext, useContext, useState, useMemo, useEffect } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import localforage from "localforage";
import { useAppServices } from "hook/services";
import Loader from "examples/Loader";
import {
  setDarkMode,
  setFixedNavbar,
  setSidenavColor,
  setTransparentSidenav,
  setWhiteSidenav,
  useMaterialUIController,
} from "context";

// Material Dashboard 2 React main context
const AgencyContext = createContext();

// Setting custom name for the context which is visible on react dev tools
AgencyContext.displayName = "AgencyContext";

// Material Dashboard 2 React context provider
function AgencyProvider({ children }) {
  const Service = useAppServices();
  const [, dispatch] = useMaterialUIController();
  const [agency, setAgency] = useState({});
  const [loader, setLoader] = useState(true);

  // Theme Functions
  const handleThemeUpdates = (updates) => {
    setSidenavColor(dispatch, updates.sideNavColor);
    setWhiteSidenav(dispatch, updates.sideNavType == "white");
    setTransparentSidenav(dispatch, updates.sideNavType == "transparent");
    setFixedNavbar(dispatch, updates.navbarFixed);
    setDarkMode(dispatch, !updates.light);
  };

  const Update = (updates) => {
    const data = { ...agency, ...updates };
    setAgency(data);
    handleThemeUpdates(data);
  };

  const clear = () => setAgency({});

  const value = useMemo(() => [agency, Update, clear], [agency, Update, clear]);

  const getAgency = async (localAgency) => {
    const token = await localforage.getItem("token");
    const { response } = await Service.agency.get({
      query: `_id=${localAgency._id}`,
      token,
    });
    if (!response) return setLoader(false);

    setAgency({ ...response.data });
    localforage.setItem("agency", { ...response.data });
    handleThemeUpdates(response.data);
    return setLoader(false);
  };

  const updateAgency = async () => {
    const localAgency = await localforage.getItem("agency");
    if (!localAgency) return setLoader(false);
    setAgency({ ...localAgency });
    handleThemeUpdates(localAgency);
    setLoader(false);
    return getAgency(localAgency);
  };

  const onLoad = () => {
    updateAgency();
  };

  useEffect(onLoad, []);

  return loader ? (
    <Loader />
  ) : (
    <AgencyContext.Provider value={value}>{children}</AgencyContext.Provider>
  );
}

// Material Dashboard 2 React custom hook for using context
function useAgencyInfo() {
  return useContext(AgencyContext) || [];
}

// Typechecking props for the MaterialUIControllerProvider
AgencyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AgencyProvider, useAgencyInfo };
