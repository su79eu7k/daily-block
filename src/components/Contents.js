import React, { useState } from 'react'
import ContentsRolling from './ContentsRolling'
import ContentWriting from './ContentWriting'
import { useSpring, animated } from 'react-spring'

function Contents () {
  const [write, setWrite] = useState(false)
  const [blocksUpdated, setBlocksUpdated] = useState(true)

  const sprTextarea = useSpring({ opacity: write ? 1 : 0 })

  return (
    <div className='card--contents--container'>
      {!write && <button id='write' type='button' onClick={() => setWrite(true)}>New</button>}
      <animated.div style={sprTextarea}>{write && <ContentWriting setWrite={setWrite} setBlocksUpdated={setBlocksUpdated} />}</animated.div>
      <ContentsRolling blocksUpdated={blocksUpdated} setBlocksUpdated={setBlocksUpdated} />
    </div>
  )
}

export default Contents
