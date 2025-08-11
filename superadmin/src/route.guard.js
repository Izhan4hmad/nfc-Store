import { Navigate, Outlet, useParams } from 'react-router-dom'

import PropTypes from 'prop-types'

export default function RouteGuard({valid, redirect, state}){
  const { location_id } = useParams()
  return valid ? <Outlet /> : <Navigate replace to={redirect} state={state || {location_id}} />
}

RouteGuard.defaultProps = {
  state: ''
}

RouteGuard.propTypes = {
  valid    : PropTypes.bool.isRequired,
  redirect : PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  state    : PropTypes.any
}