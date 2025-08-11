import React from 'react'
import { Backdrop, Fade, Modal } from '@mui/material'
import MDBox from 'components/MDBox'

import PropTypes from 'prop-types'

function MDModal({ open, onClose, children, width, height, maxHeight, overflow }) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: width || "auto",
    height: height || "auto",
    maxHeight: maxHeight || '',
    overflow: overflow || '',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      onClose={onClose}
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <MDBox sx={style}>{children}</MDBox>
      </Fade>
    </Modal>
  )
}

MDModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  width: PropTypes.string.isRequired,
  maxHeight: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  overflow: PropTypes.string.isRequired,
}

export default MDModal
