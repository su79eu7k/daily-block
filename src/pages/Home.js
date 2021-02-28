import React, { useContext } from 'react'
import AuthContext from '../context/auth-context'
import Contents from '../components/Contents'

function Home () {
  const auth = useContext(AuthContext)

  return (
    <React.Fragment>
      {auth.token && <Contents />}
    </React.Fragment>
  )
}

export default Home
