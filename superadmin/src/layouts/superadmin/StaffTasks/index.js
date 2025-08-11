import { Card, CardContent, CardMedia, Button, Grid, Typography, Box } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loader from "examples/Loader";
import { useEffect, useState } from "react";
import { useAppServices } from "hook/services";
import { useUserInfo } from "context/user";
import MDBox from "components/MDBox";

function Default() {
  const AppService = useAppServices();
  const [loader, setLoader] = useState(false);
  const [staffTask, setStaffTask] = useState([]);
  const [user] = useUserInfo();
  console.log(staffTask, "staffTask")

  const getStaff = async () => {
    setLoader(true);
    const { response } = await AppService.tasks.GetStaffTask({ query: `id=${user._id}` });
    setStaffTask(response ? response.data : []);
    setLoader(false);
  };

  useEffect(() => {
    getStaff();
  }, []);

  const cards = [
    {
      title: "PDF Generator for Workflows",
      description:
        "PDF Generator API is a tool that allows you to programmatically generate PDFs from your applications.",
      image: "https://storage.googleapis.com/a1aa/image/T2FOBwkU-Ms4ZE_KJXH5Jac5grcNf31ZbFlra5QGC2M.jpg",
      free: true,
    },
    {
      title: "Sim Pro for Workflows",
      description:
        "simPRO is a comprehensive cloud-based software solution tailored for trade and service-based businesses.",
      image: "https://storage.googleapis.com/a1aa/image/y2U-7t2PZP_zSpbMp2Vw4--ji3gDO1LHZInMx2JvNdM.jpg",
      free: true,
      hasHelpGuide: true,
    },
  ];

  return (
    <DashboardLayout>
      {loader ? (
        <Loader />
      ) : (
        <>
          <DashboardNavbar />
          <Box pt={6} pb={3}>
            <Grid container spacing={3}>
              <Typography variant="h2" color="black" textAlign="center" style={{ marginLeft: "3rem" }}>My Tasks</Typography>
              {staffTask.map((card, index) => (
                <Grid item xs={12} md={12} key={index}>
                  <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3 }}>
                    <MDBox display="flex" alignItems="center">
                      <CardMedia
                        component="img"
                        sx={{ width: 200, height: 200, borderRadius: 2 }}
                        image={card.image}
                        alt={card.title}
                      />
                      <CardContent sx={{ flex: 1, ml: 2 }}>
                        <span style={{ fontWeight: "bold" }}>Name:</span>
                        <Typography variant="body2" >
                          {card.name}
                        </Typography>
                        <span style={{ fontWeight: "bold" }}>Description:</span>
                        <Typography variant="body2" color="textSecondary" mt={1}>
                          {card.description}
                        </Typography>
                        <span style={{ fontWeight: "bold" }}>app_id:</span>
                        <Typography variant="body2" color="textSecondary" mt={1}>
                          {card.app_id}
                        </Typography>
                        {/* <span style={{ fontWeight: "bold" }}>client_id:</span>
                        <Typography variant="body2" color="textSecondary" mt={1}>
                          {card.client_id}
                        </Typography>
                        <span style={{ fontWeight: "bold" }}>client_secret:</span>
                        <Typography variant="body2" color="textSecondary" mt={1}>
                          {card.client_secret}
                        </Typography> */}
                      </CardContent>
                    </MDBox>
                    <MDBox display="flex" flexWrap="wrap" gap={2}>
                      {staffTask?.map((task) =>
                        task?.images?.map((img) => (
                          <CardMedia component="img" height="150" image={img.image} alt={img.name} />
                        ))
                      )}
                    </MDBox>



                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </DashboardLayout>
  );
}

export default Default