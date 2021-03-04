import { useMemo } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'

function Portal (props) {
  const container = useMemo(() => document.getElementById(props.container), [props.container])

  return createPortal(props.children, container)
}

Portal.propTypes = {
  container: PropTypes.string,
  children: PropTypes.element
}

export default Portal
