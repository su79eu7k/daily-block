import React, { useContext } from 'react'
import AuthContext from '../context/auth-context'
import Contents from '../components/Contents'
import Landing from '../components/Landing'

function Home () {
  const auth = useContext(AuthContext)

  return (
    <React.Fragment>
      {!auth.token && <Landing />}
      {auth.token && <Contents />}
    </React.Fragment>
  )
}

export default Home
