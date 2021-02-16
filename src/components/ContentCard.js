import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import AuthContext from '../context/auth-context'

function ContentCard (props) {
  const auth = useContext(AuthContext)
  console.log(auth)

  return (
    <div>
      <div>{props.label}</div>
      <div>{props.date}</div>
      <div>{props.content}</div>
    </div>
  )
}

ContentCard.propTypes = {
  label: PropTypes.string,
  date: PropTypes.number,
  content: PropTypes.string
}

export default ContentCard
