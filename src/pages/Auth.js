import React, { useRef, useState } from 'react'
import AuthContext from '../context/auth-context'

function Auth () {
  const [isSignUp, setIsSignUp] = useState(false)

  const emailEl = useRef(null)
  const passwordEl = useRef(null)

  const authHandler = (event, authContext) => {
    event.preventDefault()

    const email = emailEl.current.value
    const password = passwordEl.current.value

    let requestBody
    if (isSignUp) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      }
    } else {
      requestBody = {
        query: `
          query {
            login(email: "${email}", password: "${password}") {
              userId
              token
              tokenExpiration
            }
          }
        `
      }
    }

    // FIXME: No login faillure logic.
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json()
    }).then(resData => {
      const resAuth = resData.data.login
      const auth = { token: resAuth.token, uesrId: resAuth.userId, tokenExpiration: resAuth.tokenExpiration }
      authContext.login(...Object.values(auth))
      localStorage.setItem('auth', JSON.stringify(auth))
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <AuthContext.Consumer>
      {
        (authContext) => {
          return (
            <div>
              <div>{isSignUp ? 'Sign Up' : 'Sign In'}</div>
              {/* TODO: ID/PW validation feature. */}
              <div>
                <form onSubmit={(e) => { authHandler(e, authContext) }}>
                  <div>
                    <label>
                      E-Mail
                    </label>
                    <input type="email" ref={emailEl} />
                  </div>
                  <div>
                    <label>
                      Password
                    </label>
                    <input type="password" ref={passwordEl} />
                  </div>
                </form>
              </div>
              <div>
                <input type="submit" value="Submit" />
                {isSignUp && <button type="button" onClick={() => setIsSignUp(false)}>Sign In</button>}
                {!isSignUp && <button type="button" onClick={() => setIsSignUp(true)}>Sign Up</button>}
              </div>
            </div>
          )
        }
      }
    </AuthContext.Consumer>
  )
}

export default Auth
