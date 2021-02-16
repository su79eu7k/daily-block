import React from 'react'
import ContentsWriting from '../components/ContentsWriting'
import ContentsRolling from '../components/ContentsRolling'

function Home () {
  return (
    <React.Fragment>
    <h1>Home</h1>
    <ContentsWriting />
    <ContentsRolling />
    </React.Fragment>
  )
}

export default Home
