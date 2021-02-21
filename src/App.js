import React, { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import NavBar from './components/NavBar'
import Home from './pages/Home'
import Auth from './pages/Auth'

import AuthContext from './context/auth-context'

function App () {
  const [auth, setAuth] = useState({
    token: null,
    userId: null,
    tokenExpiration: null
  })

  const checkLoggedInfo = () => {
    const loggedInfo = JSON.parse(localStorage.getItem('auth'))
    if (loggedInfo) {
      setAuth(loggedInfo)
    }
  }

  useEffect(checkLoggedInfo, [])

  const login = (token, userId, tokenExpiration) => {
    setAuth({ token: token, userId: userId, tokenExpiration: tokenExpiration })
  }

  const logout = () => {
    setAuth({ token: null, userId: null, tokenExpiration: null })
    localStorage.removeItem('auth')
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ token: auth.token, userId: auth.userId, login: login, logout: logout }}>
        <NavBar />
        <main>
          <Switch>
            <Redirect from='/' to='/home' exact />
            {!auth.token &&
              <Route path='/login'>
                <Auth />
              </Route>}
            {auth.token && <Redirect from='/login' to='/home' />}
            <Route path='/home'>
              <Home />
            </Route>
          </Switch>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App
