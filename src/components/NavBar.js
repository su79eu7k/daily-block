import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../context/auth-context'

function NavBar () {
  const auth = useContext(AuthContext)
  return (
    <header id='nav-bar'>
      <div id='logo'>
        Daily Block
      </div>
      <nav id='nav'>
        <ul>
          <li>
            <NavLink to='/'><button>Home</button></NavLink>
          </li>
          {!auth.token && <li>
            <NavLink to='/login'><button>Login</button></NavLink>
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
