import ListIcon from '@mui/icons-material/List'
import AppsIcon from '@mui/icons-material/Apps'
import { Grid } from '@mui/material'
import React, { useState, useEffect } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import localforage from 'localforage'
import Filter from './Filter'
const ThemeNavbar = (props) => {
  const [price, setprice] = useState('')
  const [GridView, setGridView] = useState(false)
  const [filter, setfilter] = useState(false)

  useEffect(async () => {
    // alert(props?.initState?.Filter)
    // console.log(GridView,'initStateinitStateinitState');
    // console.log(filter,'initStateinitStateinitState');
    setfilter(props.initState.Filter)
    setGridView(props.initState.GridView)
  }, [props?.initState])

  // const handleChange = (event) => {
  //   setprice(event.target.value);
  // };
  // const handleMessage =  (message)=>{
  //     props.handleview(message)
  //   }
  return (
    <>
      <Grid sx={{ marginTop: '1px' }}>
        {filter == true ? (
          <>
            <Filter handlerange={props.handlerange} handelchange={props.handelchange} />
          </>
        ) : (
          <></>
        )}
        {GridView == true ? (
          <>
            <AppsIcon fontSize="medium" sx={{ cursor: 'pointer', marginRight: '8px' }} />
            <ListIcon
              fontSize="medium"
              sx={{ marginRight: '8px', cursor: 'pointer', width: '1.2em', height: '1.2em' }}
            />
          </>
        ) : (
          <></>
        )}
      </Grid>
    </>
  )
}

export default ThemeNavbar
