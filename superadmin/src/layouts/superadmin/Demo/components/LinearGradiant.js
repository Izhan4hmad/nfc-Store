import MDBox from 'components/MDBox'
import MDInput from 'components/MDInput'
import MDTypography from 'components/MDTypography'
import React, { useState, useEffect } from 'react'
import ColorPicker from 'react-best-gradient-color-picker'

const LinearGradiant = (props) => {
  var data = ''
  const [color, setColor] = useState(data)
  React.useEffect(async () => {
    if (props.type == 'cardsBodyColor') {
      data = getComputedStyle(document.documentElement).getPropertyValue('--cardsBodyColor')
    } else if (props.type == 'sideNavCard') {
      data = getComputedStyle(document.documentElement).getPropertyValue('--sideNavCard')
    } else if (props.type == 'ThemeBackground') {
      data = props.color
    } else {
      data = getComputedStyle(document.documentElement).getPropertyValue('--sidnavBg')
    }
    if (color != '') {
      props.handleChange({ value: color, key: props.type })
    }
  }, [color])
  return (
    <>
      <MDBox sx={{ width: '100%', display: 'flex', justifyContent: 'center' }} mt={2}>
        <ColorPicker value={color} onChange={setColor} />
      </MDBox>
    </>
  )
}

export default LinearGradiant
