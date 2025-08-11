import React from 'react'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import { useState } from 'react'
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
const Navbar = (props) => {
  const [open, setOpen] = useState({
    listGridView: false,
    cards: false,
    features: false,
    navbar: false,
    defeult_settings: false,
});
  const handleClick = (e) => {
    var name = e
    const statedata = {
        'listGridView': () => { setOpen({ listGridView: !open.listGridView }) },
        'cards': () => { setOpen({ cards: !open.cards }) },
        'navbar': () => { setOpen({ navbar: !open.navbar }) },
        'features': () => { setOpen({ features: !open.features }) },
        'defeult_settings': () => { setOpen({ defeult_settings: !open.defeult_settings }) },
    }
    statedata[name]();

};
  return (
    <>

                                                                <MDBox sx={{ marginTop: 3 }} display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
                      <MDTypography variant="h6">Show List and Grid View Button</MDTypography>
                      
                          <input type="checkbox" style={{ width: '19px', height: "19px", marginRight: "11px" }}
                          onClick={(e) => props.handleChange({ value: e.target.checked, key: 'GridView' })}
                        />
                     


                    </MDBox>
                    <MDBox sx={{ marginTop: 3 }} display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
                      <MDTypography variant="h6">Show Filter Button</MDTypography>
                     
                          <input type="checkbox" style={{ width: '19px', height: "19px", marginRight: "11px" }}
                          onClick={(e) => props.handleChange({ value: e.target.checked, key: 'Filter' })}
                        />
                     


                    </MDBox>
                    <MDBox sx={{ marginTop: 3 }} display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
                      <MDTypography variant="h6">convert sidbar to navbar</MDTypography>
                      
                          <input type="checkbox"
                          name='navbar-category'
                          style={{ width: '19px', height: "19px", marginRight: "11px" }}
                          onClick={(e) => props.handleChange({ value: e.target.checked, key: 'Categries' })}
                        />
                           

                    </MDBox>
                  </>
  )
}

export default Navbar