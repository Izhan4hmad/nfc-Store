
import { useState, useEffect } from 'react'

// @mui material components
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
import Icon from '@mui/material/Icon'

// Material Dashboard 2 React components
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import MDButton from 'components/MDButton'

// Custom styles for the Configurator
import ConfiguratorRoot from 'examples/Configurator/ConfiguratorRoot'

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setOpenConfigurator,
  setTransparentSidenav,
  setWhiteSidenav,
  setFixedNavbar,
  setDarkMode,
} from 'context'
import { Autocomplete, Button, MenuItem, TextField } from '@mui/material'
import { useDashboardStats } from 'context/dashboard'

function Configurator() {
  const [formData, setFormData] = useState({
    date_range: 'month',
    companies: 3
  });
  const { statLoading, setStatLoading } = useDashboardStats();
  const [controller, dispatch] = useMaterialUIController()
  const {
    openConfigurator,
    darkMode,
  } = controller

  const handleCloseConfigurator = () => setOpenConfigurator(dispatch, false)

  const dateRangeOptions = [
    { label: 'Last Month', value: 'month' },
    { label: 'Last Three Months', value: 'quarter' },
    { label: 'Last Year', value: 'year' },
  ];
  const chooseCompanies = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleDateRangeSelect = (event, value) => {
    if (value) {
      setFormData((prevData) => ({
        ...prevData,
        date_range: value.value,
      }));
    }
  };

  const handleCompanySelect = (event, value) => {
    if (value) {
      setFormData((prevData) => ({
        ...prevData,
        companies: value,
      }));
    }
  };

  const handleFilter = async () => {
    console.log('//dfafd', formData);
  }

  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator }}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="baseline"
        pt={4}
        pb={0.5}
        px={3}
      >
        <MDBox>
          <MDTypography variant="h5">Filter Data</MDTypography>
          <MDTypography variant="body2" color="text">
            Filter dashboard data.
          </MDTypography>
        </MDBox>

        <Icon
          sx={({ typography: { size }, palette: { dark, white } }) => ({
            fontSize: `${size.lg} !important`,
            color: darkMode ? white.main : dark.main,
            stroke: 'currentColor',
            strokeWidth: '2px',
            cursor: 'pointer',
            transform: 'translateY(5px)',
          })}
          onClick={handleCloseConfigurator}
        >
          close
        </Icon>
      </MDBox>

      <Divider />

      <MDBox pt={0.5} pb={3} px={3}>
        <MDBox>
          <MDTypography variant="h6">Date Range</MDTypography>
          <MDBox mb={0.5} mt={2}>
            <Autocomplete
              options={dateRangeOptions}
              value={dateRangeOptions.find((option) => option.value === formData.date_range) || null}
              getOptionLabel={(option) => option.label}
              onChange={handleDateRangeSelect}
              renderInput={(params) => <TextField {...params} label="Select Date Range" variant="outlined" />}
              fullWidth
              disableClearable
            />
          </MDBox>
        </MDBox>

        <Divider />

        <MDBox>
          <MDTypography variant="h6">Find Top Companies</MDTypography>
          <MDBox mb={0.5} mt={2}>
            <Autocomplete
              options={chooseCompanies}
              value={chooseCompanies.find((option) => option === formData.companies) || null}
              onChange={handleCompanySelect}
              getOptionLabel={(option) => option.toString()}
              renderInput={(params) => <TextField {...params} label="Select Number" variant="outlined" />}
              fullWidth
            />
          </MDBox>
        </MDBox>

        <Divider />

        <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
          <MDButton
            component={Button}
            onClick={handleFilter}
            color="primary"
            disabled={statLoading}
          >
            Filter
          </MDButton>
        </MDBox>
      </MDBox>
    </ConfiguratorRoot>
  )
}

export default Configurator
