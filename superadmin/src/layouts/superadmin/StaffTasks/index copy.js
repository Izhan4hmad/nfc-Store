import { Container, Box, Button, Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loader from "examples/Loader";
import { useEffect, useState } from "react";
import { useAppServices } from "hook/services";
import { useUserInfo } from "context/user";

function Default() {
  const AppService = useAppServices();
  const [loader, setLoader] = useState(false);
  const [staffTask, setStaffTask] = useState([]);
  const [user] = useUserInfo();

  const getStaff = async () => {
    setLoader(true);
    const { response } = await AppService.tasks.GetStaffTask({ query: `id=${user._id}` });
    setStaffTask(response ? response.data : []);
    setLoader(false);
  };

  useEffect(() => {
    getStaff();
  }, []);

  return (
    <DashboardLayout>
      {loader ? (
        <Loader />
      ) : (
        <>
          <DashboardNavbar />
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography color="textSecondary">App Category ({staffTask.length})</Typography>
              <Typography color="textSecondary">Distribution Type</Typography>
            </Box>

            <Grid container spacing={4} mb={8}>
              {staffTask.length > 0 ? (
                staffTask.map((item, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card>
                      <CardMedia component="img" height="200" image={item.image} alt={item.title} />
                      <CardContent>
                        <Typography variant="h6" align="center">{item.title}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography>No data available</Typography>
              )}
            </Grid>

            {/* Videos Section */}
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Videos
            </Typography>
            <Grid container spacing={4} mb={8}>
              {staffTask.length > 0 ? (
                staffTask.map((item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.videoThumbnail || item.image}
                        alt={item.title}
                      />
                      <Box position="absolute" top="50%" left="50%" sx={{ transform: "translate(-50%, -50%)" }}>
                        <Button variant="contained" color="primary" sx={{ borderRadius: "50%", p: 2 }}>
                          <PlayArrow />
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography>No videos available</Typography>
              )}
            </Grid>
          </Container>
        </>
      )}
    </DashboardLayout>
  );
}

export default Default;
