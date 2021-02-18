import React, { useState } from 'react'
import ContentsRolling from './ContentsRolling'
import ContentWriting from './ContentWriting'

function Contents () {
  const [blocksUpdated, setBlocksUpdated] = useState(true)

  return (
    <div>
      <ContentWriting setBlocksUpdated={setBlocksUpdated} />
      <ContentsRolling blocksUpdated={blocksUpdated} setBlocksUpdated={setBlocksUpdated} />
    </div>
  )
}

export default Contents
