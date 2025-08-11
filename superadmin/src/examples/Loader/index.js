import { Grid } from '@mui/material'
import MDProgressCircular from 'components/MDProgressCircular'
import React from 'react'

function Loader() {
  return (
    <Grid
      container
      spacing        = {0}
      direction      = "column"
      alignItems     = "center"
      justifyContent = "center"
      style          = {{ minHeight: '100vh' }}
    >
    <Grid item xs={3}>
     <MDProgressCircular/>
    </Grid>   
  </Grid> 
    
  )
}

export default Loader