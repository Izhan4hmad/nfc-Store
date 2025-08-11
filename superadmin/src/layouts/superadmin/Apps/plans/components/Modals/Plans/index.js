import MDButton from "components/MDButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import React, { useEffect, useState } from "react";
import MDModal from "components/MDModal";
import MDInput from "components/MDInput";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useAppServices } from "hook/services";
import { useParams } from "react-router-dom";
const PlansModal = (props) => {
  const Service = useAppServices();
  const { app_id } = useParams()
  const [openAddProduct, setOpenAddProduct] = useState(false);
  function AddProduct({ open, onClose }) {
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setProcessing(true);
      let plans = []
      plans = props.plans
      const plan = {
        name: e.target.name.value,
        plan_id: e.target.plan_id.value,
        price: e.target.price.value,
      }
      plans.push(plan)
      const payload = {
        plans: plans,
        _id: app_id,
      };
      const { response } = await Service.app.update({ payload });
      if (response) {
        setOpenAddProduct(false);
        setProcessing(false);
        props.handleChange();
      } else {
        setProcessing(false);
      }
    };
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      height: 'auto',
      overflow: 'auto',
      bgcolor: 'background.paper',
      border: '2px  #000',
      boxShadow: 24,
      p: 4,
    }
    return (
      <MDModal open={open} onClose={onClose}>
        <MDBox>
          <MDTypography component="h1" mb={3} variant="h5">
            Plan
          </MDTypography>

          <MDBox
            component="form"
            onSubmit={handleSubmit}
            role="form"
            sx={style}
          >
            <Grid item md={12}>
              <MDBox mb={1}>
                <MDTypography variant="button" display="block" gutterBottom>
                  Plan Name
                </MDTypography>
                <MDInput
                  defaultValue=""
                  id="bootstrap-input"
                  fullWidth
                  placeholder="Plan Name"
                  name="name"
                />
              </MDBox>
            </Grid>
            <Grid item md={12}>
              <MDBox mb={1}>
                <MDTypography variant="button" display="block" gutterBottom>
                  Plan ID
                </MDTypography>
                <MDInput
                  defaultValue=""
                  id="bootstrap-input"
                  fullWidth
                  placeholder="Plan ID"
                  name="plan_id"
                />
              </MDBox>
            </Grid>
            <Grid item md={12}>
              <MDBox mb={1}>
                <MDTypography variant="button" display="block" gutterBottom>
                  Plan Price
                </MDTypography>
                <input
                  style={{
                    padding: " 4px 0 5px",
                    border: 0,
                    boxSizing: "content-box",
                    background: "none",
                    height: " 1.4375em",
                    margin: 0,
                    display: "block",
                    width: "100%",
                    padding: "16.5px 14px",
                    color: "#495057",
                    padding: "0.75rem",
                    backgroundColor: "transparent",
                  }}
                  id="bootstrap-input"
                  type="number"
                  fullWidth
                  placeholder="Plan Price"
                  name="price"
                  step="0.01"
                />
              </MDBox>
            </Grid>
            <MDBox>
              <MDButton
                variant="gradient"
                color="info"
                type="submit"
                disabled={processing}
                loading={processing}
                sx={{ mt: 4, mb: 1 }}
                fullWidth
              >
                Add
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDModal>
    );
  }
  const closeAddProduct = (subscription) => {
    // if (subscription?._id)
    setOpenAddProduct(false);
  };
  return (
    <>
      <MDButton
        sx={{ marginLeft: 3 }}
        variant="outlined"
        color="info"
        startIcon={<AddBoxIcon />}
        onClick={() => setOpenAddProduct(true)}
      >
        Plan
      </MDButton>
      <AddProduct open={openAddProduct} onClose={closeAddProduct} />
    </>
  );
};

export default PlansModal;
