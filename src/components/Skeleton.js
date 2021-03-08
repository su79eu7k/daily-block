import React from 'react'

function Skeleton () {
  return (
      <div className='card--content--container'>
        <div className='card--content--info'>
        <div className='timestamp' id='skeleton'></div>
        <ul>
          <li><div className='icon-btn' id='skeleton'></div></li>
          <li><div className='icon-btn' id='skeleton'></div></li>
        </ul>
        </div>
        <div className='card--content--label' id='skeleton'><h1># </h1></div>
        <div className='card--content--content' id='skeleton'></div>
      </div>
  )
}

export default Skeleton
