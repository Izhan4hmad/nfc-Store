/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Soft UI Dashboard PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

function FormField({ label, defaultValue, ...rest }) {
  return (
    <MDBox
      display="flex"
      flexDirection="column"
      justifyContent="flex-end"
      height="100%"
    >
      <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
        <MDTypography
          component="label"
          variant="caption"
          fontWeight="bold"
          textTransform="capitalize"
        >
          {label}
        </MDTypography>
      </MDBox>
      <MDInput {...rest} defaultValue={defaultValue} />
    </MDBox>
  );
}

// Setting default values for the props of FormField
FormField.defaultProps = {
  label: " ",
};

// Typechecking props for FormField
FormField.propTypes = {
  label: PropTypes.string,
  defaultValue: PropTypes.string,
};

export default FormField;
