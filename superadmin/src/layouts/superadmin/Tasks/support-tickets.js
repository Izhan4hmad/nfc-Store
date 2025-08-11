import { Card } from "@mui/material";
import Grid from "@mui/material/Grid";

// MD UI Dashboard PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// MD UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import AppData from "./components/data-tables/data/dataTableData";
import CreateModal from "./components/CreateModal";
import { useEffect } from "react";
import Loader from "examples/Loader";

function SupportTickets() {
  const { dataTableData, handleRefresh, staff, apps, loader, ghlFeatures, team, tags, jobs } = AppData();

  const onLoad = () => { };

  useEffect(onLoad, []);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <MDBox pt={3} px={3}>
                  <DataTable
                    table={dataTableData}
                    canSearch
                    entriesPerPage={25}
                  />
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </>
  );
}

export default SupportTickets;
