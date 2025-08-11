
import Tooltip from '@mui/material/Tooltip'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import MDAvatar from 'components/MDAvatar'
import { useState } from 'react';
import { useDashboardStats } from 'context/dashboard';

export default function data() {
  const [topThreeComp, setTopThreeComp] = useState();
  const { statLoading, appCompanies } = useDashboardStats();

  if (!statLoading) {
    // Get the first and last date for the previous month
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // First day of last month
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of last month

    // Top Three Companies for Last Month
    const TopCompanies = appCompanies
      ?.filter(company => {
        const companyDate = new Date(company.createdAt); // Assuming `createdAt` is the date field
        return companyDate >= startOfLastMonth && companyDate <= endOfLastMonth;
      })
      .map(company => ({
        company_name: company.Name,
        company_id: company.CompanyID,
        logo: company.Logo_URL,
        locations: company?.location_count,
        app_count: company.app_id ? company.app_id.length : 0,
      }))
      .sort((a, b) => b.app_count - a.app_count) // Sort by app_count in descending order
      .slice(0, 3);

    setTopThreeComp(TopCompanies);
  }

  const Company = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  )
  var rows;
  if (!statLoading) {
    rows = topThreeComp?.map((company) => ({
      name: <Company image={company?.logo} name={company?.company_name} />,
      apps: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {company.app_count}
        </MDTypography>
      ),
      locations: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {company.locations}
        </MDTypography>
      )
    }));
  }

  return {
    columns: [
      { Header: 'name', accessor: 'name', width: '45%', align: 'left' },
      { Header: 'apps', accessor: 'apps', width: '10%', align: 'left' },
      { Header: 'locations', accessor: 'locations', align: 'center' },
    ],
    rows,
    statLoading
  }
}
