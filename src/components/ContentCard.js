import React from 'react'
import PropTypes from 'prop-types'

import LabelContext from '../context/label-context'

function ContentCard (props) {
  return (
    <LabelContext.Consumer>
      {
        (context) => {
          return (
            <div>
              <div onClick={() => {
                props.label === context.currentLabel ? context.changeLabel('') : context.changeLabel(props.label)
              }}>{props.label}</div>
              <div>{props.date}</div>
              <div>{props.content}</div>
            </div>
          )
        }
      }
    </LabelContext.Consumer>
  )
}

ContentCard.propTypes = {
  label: PropTypes.string,
  date: PropTypes.string,
  content: PropTypes.string
}

export default ContentCard
