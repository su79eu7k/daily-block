import React, { useRef, useState } from 'react'
import AuthContext from '../context/auth-context'

function Auth () {
  const [isSignUp, setIsSignUp] = useState(false)

  const emailEl = useRef(null)
  const passwordEl = useRef(null)

  const authHandler = (event, context) => {
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

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json()
    }).then(resData => {
      context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <AuthContext.Consumer>
      {
        (auth) => {
          return (
            <div>
              <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
              <form onSubmit={(e) => { authHandler(e, auth) }}>
                <div>
                  <label>
                    E-Mail:
            <input type="email" ref={emailEl} />
                  </label>
                </div>
                <div>
                  <label>
                    Password:
            <input type="password" ref={passwordEl} />
                  </label>
                </div>
                <input type="submit" value="Submit" />
                {isSignUp && <button type="button" onClick={() => setIsSignUp(false)}>Sign In</button>}
                {!isSignUp && <button type="button" onClick={() => setIsSignUp(true)}>Sign Up</button>}
              </form>
            </div>
          )
        }
      }
    </AuthContext.Consumer>
  )
}

export default Auth
