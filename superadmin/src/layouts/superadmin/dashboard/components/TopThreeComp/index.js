import { useState, useEffect } from 'react';

// @mui material components
import Card from '@mui/material/Card';
import logoXD from 'assets/images/small-logos/logo-xd.svg'

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Material Dashboard 2 React examples
import DataTable from 'examples/Tables/DataTable';

import { useDashboardStats } from 'context/dashboard';

function TopThreeComp() {
  const { statLoading, appCompanies, topCompanies } = useDashboardStats();
  const [topThreeComp, setTopThreeComp] = useState([]);

  // Fetch Top Three Companies
  useEffect(() => {
    if (!statLoading && appCompanies) {
      const now = new Date();
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const TopCompanies = appCompanies
        ?.filter((company) => {
          const companyDate = new Date(company.createdAt);
          return companyDate >= startOfLastMonth && companyDate <= endOfLastMonth;
        })
        .map((company) => ({
          company_name: company.Name,
          company_id: company.CompanyID,
          logo: company.Logo_URL,
          locations: company?.location_count,
          app_count: company.app_id ? company.app_id.length : 0,
        }))
        .sort((a, b) => b.app_count - a.app_count) // Sort by app count in descending order
        .slice(0, 3);

      setTopThreeComp(TopCompanies);
    }
  }, [statLoading, appCompanies]);

  // Loading state
  if (statLoading) {
    return (
      <Card>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          <MDTypography variant="h6">Top Three Companies</MDTypography>
        </MDBox>
        <MDBox p={3}>
          <MDTypography variant="body2" color="textSecondary">Loading...</MDTypography>
        </MDBox>
      </Card>
    );
  }

  // Table data
  const columns = [
    { Header: 'Name', accessor: 'name', width: '45%', align: 'left' },
    { Header: 'Apps', accessor: 'apps', width: '10%', align: 'left' },
    { Header: 'Locations', accessor: 'locations', align: 'center' },
  ];
  
  const rows = topThreeComp.map((company) => ({
    name: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <img src={company.logo ? company.logo : logoXD} style={{ width: '30px', borderRadius: '50%' }} />
        <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
          {company.company_name}
        </MDTypography>
      </MDBox>
    ),
    apps: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {company.app_count}
      </MDTypography>
    ),
    locations: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {company.locations}
      </MDTypography>
    ),
  }));

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Top Companies
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  )
}

export default TopThreeComp;
