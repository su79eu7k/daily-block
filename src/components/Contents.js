import React, { useState } from 'react'
import ContentsRolling from './ContentsRolling'
import ContentWriting from './ContentWriting'

function Contents () {
  const [write, setWrite] = useState(false)
  const [blocksUpdated, setBlocksUpdated] = useState(true)

  return (
    <div className='card--contents--container'>
      {!write && <button type="button" onClick={() => setWrite(true)}>Write</button>}
      {write && <ContentWriting setWrite={setWrite} setBlocksUpdated={setBlocksUpdated} />}
      <ContentsRolling blocksUpdated={blocksUpdated} setBlocksUpdated={setBlocksUpdated} />
    </div>
  )
}

export default Contents
