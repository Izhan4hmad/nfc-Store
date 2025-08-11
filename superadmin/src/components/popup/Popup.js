import './Popup.scss'

import React, { useState } from 'react'
import PropTypes from 'prop-types'

function Poppup({ open, close, component: Component, className, style }) {
  return (
    <div id="Popup">
      {open && (
        <>
          <div className="body" style={style}>
            <div className={`body-content ${className}`} style={style}>
              {Component}
            </div>
            <div onClick={close} className="back-drop"></div>
          </div>
        </>
      )}
    </div>
  )
}

Poppup.propTypes = {
  component: PropTypes.element,
  open: PropTypes.bool,
  close: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
}

export default Poppup
