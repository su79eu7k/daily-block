import React from 'react'
import PropTypes from 'prop-types'

function Skeleton (props) {
  return (
      <div className='card--content--container'>
        <div className='card--content--info'>
        <div className='timestamp' id='skeleton'></div>
        <ul>
          <li><div className='icon-btn' id='skeleton'></div></li>
          <li><div className='icon-btn' id='skeleton'></div></li>
        </ul>
        </div>
        {
          props.currentLabel === '' ? <div className='card--content--label' id='skeleton'><h1># </h1></div> : null
        }
        <div className='card--content--content' id='skeleton'></div>
      </div>
  )
}

Skeleton.propTypes = {
  currentLabel: PropTypes.string
}

export default Skeleton
