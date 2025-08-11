import Grid from "@mui/material/Grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Tasks from "./tasks";
import SupportTickets from "./support-tickets";
import Header from "./components/Tabs";

function Default() {
  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <Grid container mt={10}>
          <Grid item xs={12}>
            <Header elements={[<Tasks />, <SupportTickets />]} />
          </Grid>
        </Grid>
      </DashboardLayout>
    </>
  );
}

export default Default;
