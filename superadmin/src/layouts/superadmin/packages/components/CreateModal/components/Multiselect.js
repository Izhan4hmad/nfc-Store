// import makeAnimated from 'react-select/animated'
import Select from 'react-select'
import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// const animatedComponents = makeAnimated()

function Multiselect({ edit_data, data, name, isMulti }) {
  const [values, setvalues] = useState(JSON.stringify(edit_data))
  const [selectedData, setselectedData] = useState(JSON.stringify(edit_data))
  const [SelectAll, setSelectAll] = useState([])

  const handlechange = (e) => {
    // console.log(e)
    if (isMulti) {
      const exists = e.some((item) => item.value === 'select_all')
      if (exists) {
        setvalues(JSON.stringify(data))
        setselectedData(data)
      } else {
        setvalues(JSON.stringify(e))
        setselectedData(e)
      }
    } else {
      setvalues(JSON.stringify(e))
    }
  }
  useEffect(async () => {}, [])

  return (
    <>
      {isMulti ? (
        <Select
          isMulti
          closeMenuOnSelect={true}
          defaultValue={edit_data}
          value={selectedData}
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
