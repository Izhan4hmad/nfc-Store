import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import MDBox from 'components/MDBox'
import MDInput from 'components/MDInput'
import MDTypography from 'components/MDTypography'
import React, { useState } from 'react'

function RadioInput(props) {
  const [selectedValue, setSelectedValue] = useState(
    props.edit_data != undefined ? props.edit_data : props.options[0] ? props.options[0].value : ''
  )
  const handleChange = (event) => {
    setSelectedValue(event.target.value)
  }

  return (
    <>
      <RadioGroup aria-label="options" name="options" value={selectedValue} onChange={handleChange}>
        {props.options.map((item, key) => (
          <FormControlLabel value={item.value} control={<Radio />} label={item.label} />
        ))}
      </RadioGroup>
      {selectedValue == 'auth' ? (
        <>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Auth Url
            </MDTypography>
            <MDInput
              label="Auth Url"
              placeholder="Auth Url"
              name="auth_url"
              fullWidth
              defaultValue={props.data?.auth_url}
            />
          </MDBox>
          <input type="hidden" name={props.name} value={selectedValue} />
        </>
      ) : selectedValue == 'out_bound' || selectedValue == 'out_bound_auth' ? (
        <>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Invite Link
            </MDTypography>
            <MDInput
              label="Invite Link"
              placeholder="Invite Link"
              name="auth_url"
              fullWidth
              defaultValue={props.data?.auth_url}
            />
          </MDBox>
          <input type="hidden" name={props.name} value={selectedValue} />
        </>
      ) : (
        <>
          <input type="hidden" name={props.name} value={selectedValue} />
          <input type="hidden" name="auth_url" />
        </>
      )}
    </>
  )
}

export default RadioInput
