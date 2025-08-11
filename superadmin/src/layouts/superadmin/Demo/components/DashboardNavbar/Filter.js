import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import MDInput from 'components/MDInput'

const Filter = (props) => {

    const [open, setOpen] = React.useState(false);
  const [age, setAge] = React.useState('');
  const [start_num, setstart_num] = React.useState('');
  const [end_num, setend_num] = React.useState('');


  const handleChange = (event) => {
    setAge(Number(event.target.value) || '');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };
  const handlesubmit = (event, reason) => {
    props.handlerange(start_num,end_num)
    props.handelchange()
    if (reason !== 'backdropClick') {
        setOpen(false);
      }
  };

  return (
     <>
      <Button variant="outlined" size="small" onClick={handleClickOpen} sx={{color:'blue',marginTop:'-3px',marginRight:2}}>
          Filter
        </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Filter</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
            <label htmlFor="" className='mb-2'>Starting</label>
            <input type="number" placeholder="$" name='starting_num'  className='form-control' onChange={e => setstart_num(e.target.value)}/>

            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
            <label htmlFor="" className='mb-2'>Ending</label>
            <input type="number" placeholder="$" name='ending_num'  className='form-control' onChange={e => setend_num(e.target.value)}/>

            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handlesubmit}>Apply</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Filter