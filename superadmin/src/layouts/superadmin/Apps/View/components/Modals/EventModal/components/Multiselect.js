// import makeAnimated from 'react-select/animated'
import Select from 'react-select'
import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// const animatedComponents = makeAnimated()

function Multiselect({ edit_data, data, name, isMulti, setType }) {
  const [values, setvalues] = useState(JSON.stringify(edit_data))

  const handlechange = (e) => {
    // console.log(JSON.stringify(e))
    setvalues(JSON.stringify(e))
    if (name == 'type') {
      setType(e.value)
    }

    // console.log(e.value)
  }

  return (
    <>
      {isMulti ? (
        <Select
          isMulti
          closeMenuOnSelect={false}
          defaultValue={edit_data}
          onChange={handlechange}
          options={data}
        />
      ) : (
        <Select
          closeMenuOnSelect={true}
          defaultValue={edit_data}
          onChange={handlechange}
          options={data}
        />
      )}

      <input type="hidden" value={values} name={name} />
    </>
  )
}
export default Multiselect

Multiselect.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.array,
  edit_data: PropTypes.array,
  isMulti: PropTypes.bool,
}
