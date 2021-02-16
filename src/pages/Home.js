import React, { useContext } from 'react'
import AuthContext from '../context/auth-context'
import ContentsWriting from '../components/ContentsWriting'
import ContentsRolling from '../components/ContentsRolling'

function Home () {
  const auth = useContext(AuthContext)

  return (
    <React.Fragment>
    <h1>Home</h1>
    {auth.token && <ContentsWriting />}
    {auth.token && <ContentsRolling />}
    </React.Fragment>
  )
}

export default Home
