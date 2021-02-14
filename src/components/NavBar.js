import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../context/auth-context'

function NavBar () {
  const auth = useContext(AuthContext)
  return (
    <header>
      <div>
        <h1>DB</h1>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to='/'>Home</NavLink>
          </li>
          {!auth.token && <li>
            <NavLink to='/login'>Login</NavLink>
          </li>}
          {auth.token && <li>
            <button onClick={auth.logout}>Logout</button>
          </li>}
        </ul>
      </nav>
    </header>
  )
}

export default NavBar
