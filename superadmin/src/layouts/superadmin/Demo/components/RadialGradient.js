import { Grid } from '@material-ui/core'
import MDBox from 'components/MDBox'
import MDInput from 'components/MDInput'
import MDTypography from 'components/MDTypography'
import React, { useState, useEffect } from 'react'

const RadialGradient = (props) => {
  const [firstcolor, setfirstcolor] = useState('#ff0080')
  const [secondcolor, setsecondcolor] = useState('#ddd')
  const [postion_x, setpostion_x] = useState('0')
  const [postion_y, setpostion_y] = useState('0')
  const [background, setbackground] = useState('radial-gradient(circle at 47% 59%, #ff0080, #ddd)')
  const handleChange = async ({ key, value }) => {
    var color_manage = {
      firstcolor: () => {
        setfirstcolor(value)
        setbackground(
          `radial-gradient(circle at ${postion_x}% ${postion_y}%, ${value}, ${secondcolor})`
        )
      },
      postion_x: () => {
        setpostion_x(value)
        setbackground(
          `radial-gradient(circle at ${value}% ${postion_y}%, ${firstcolor}, ${secondcolor})`
        )
      },
      postion_y: () => {
        setpostion_y(value)
        setbackground(
          `radial-gradient(circle at ${postion_x}% ${value}%, ${firstcolor}, ${secondcolor})`
        )
      },
      secondcolor: () => {
        setsecondcolor(value)
        setbackground(
          `radial-gradient(circle at ${postion_x}% ${postion_y}%, ${firstcolor}, ${value})`
        )
      },
    }
    await color_manage[key]()

    // console.log(background)
    props.handleChange({ value: background, key: 'sideNavType' })
  }
  return (
    <MDBox mt={1} display="flex" justifyContent="center" alignItems="center" lineHeight={1}>
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ border: '1px solid #d2d4d7', borderRadius: '0.25rem', width: '95%' }}
        p={2}
      >
        <Grid container>
          <Grid item xs={6}>
            <MDBox display="flex" justifyContent="flex-start" sx={{ fontSize: '14px' }}>
              <b>POSITION X</b>
            </MDBox>
            <MDBox display="flex" justifyContent="flex-start" mt={1}>
              <input
                defaultValue="0"
                type="range"
                min="-20"
                max="120"
                onChange={(e) => handleChange({ value: e.target.value, key: 'postion_x' })}
              />
            </MDBox>
          </Grid>
          <Grid item xs={6}>
            <MDBox display="flex" justifyContent="flex-end" sx={{ fontSize: '14px' }}>
              <b>POSITION Y</b>
            </MDBox>
            <MDBox display="flex" justifyContent="flex-end" mt={1}>
              <input
                defaultValue="0"
                type="range"
                min="-20"
                max="120"
                onChange={(e) => handleChange({ value: e.target.value, key: 'postion_y' })}
              />
            </MDBox>
          </Grid>

          <Grid item xs={6}>
            <MDBox display="flex" justifyContent="flex-start" mt={2}>
              <input
                type="color"
                name="sidenav_custom_color"
                // sx={{paddingLeft:"90%"}}
                value={firstcolor}
                onChange={(e) => handleChange({ value: e.target.value, key: 'firstcolor' })}
              />
              <MDBox
                sx={{
                  border: '1px solid #d2d4d7',
                  borderRadius: '0.25rem',
                  fontSize: '12px',
                  fontWeight: '300',
                }}
                p={1}
                ml={1}
              >
                {firstcolor}
              </MDBox>
            </MDBox>
          </Grid>
          <Grid item xs={6}>
            <MDBox display="flex" justifyContent="flex-end" mt={2}>
              <input
                type="color"
                name="sidenav_custom_color"
                // sx={{paddingLeft:"90%"}}
                value={secondcolor}
                onChange={(e) => handleChange({ value: e.target.value, key: 'secondcolor' })}
              />
              <MDBox
                sx={{
                  border: '1px solid #d2d4d7',
                  borderRadius: '0.25rem',
                  fontSize: '12px',
                  fontWeight: '300',
                }}
                p={1}
                ml={1}
              >
                {secondcolor}
              </MDBox>
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox sx={{ width: '100%', height: '300px', background: background }} mt={2}></MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  )
}

export default RadialGradient
