import React, { useRef, useState } from 'react'
import AuthContext from '../context/auth-context'
import AuthGoogle from '../components/AuthGoogle'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'

const StyledAuthContainer = styled(animated.div)`
  margin: 3rem auto;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`

const StyledAuthHeader = styled.div`
  margin: 1rem auto;
`

const StyledAuthBody = styled.div`
  min-width: 240px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`

const StyledAuthBodyElem = styled.div`
  margin: 1rem auto;

  & label {
    min-width: 240px;
    font-size: .7rem;
    display: block;
  }

  & input {
    min-width: 240px;
    border-radius: .3rem;
    border-width: 0px;
    border-color: #857e7a;
    padding:.7rem;
    background-color:white;

    &:focus {
      outline: none;
    }
  }
`

const StyledAuthFooter = styled.div`
  margin: 2rem auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;

  & input, button {
    height: 2rem;
    width: 4rem;
    margin: .3rem;
    border-width: 0px;
    border-radius: 1rem;
    background-color: #857e7a;
    font-family: inherit;
    font-size: .7rem;
    color: #ffffff;

    &:hover {
      background-color: #443c36;
      cursor: pointer;
    }

    &:focus {
      outline: none;
    }
  }
`

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
              token
            }
          }
        `
      }
    }

    // FIXME: No user creation success/failed, login faillure logic.
    fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }).then(res => {
      return res.json()
    }).then(resData => {
      if (isSignUp) {
        console.log(resData.email)
      } else {
        const resAuth = resData.data.login
        const auth = { token: resAuth.token }
        authContext.login(...Object.values(auth))
        localStorage.setItem('auth', JSON.stringify(auth))
      }
    }).catch(err => {
      console.log(err)
    })
  }

  const styledProps = useSpring({ opacity: 1, from: { opacity: 0 } })

  return (
    <AuthContext.Consumer>
      {
        (authContext) => {
          return (
            <StyledAuthContainer style={styledProps}>
              <StyledAuthHeader>{isSignUp ? 'Sign Up' : 'Sign In'}</StyledAuthHeader>
              {/* TODO: ID/PW validation feature. */}
              <StyledAuthBody>
                <form onSubmit={(e) => { authHandler(e, authContext) }}>
                  <StyledAuthBodyElem>
                    <label>
                      E-Mail
                    </label>
                    <input type="email" ref={emailEl} />
                  </StyledAuthBodyElem>
                  <StyledAuthBodyElem>
                    <label>
                      Password
                    </label>
                    <input type="password" ref={passwordEl} />
                  </StyledAuthBodyElem>
                  <StyledAuthFooter>
                    <input type="submit" value="Submit" />
                    {isSignUp && <button type="button" onClick={() => setIsSignUp(false)}>Sign In</button>}
                    {!isSignUp && <button type="button" onClick={() => setIsSignUp(true)}>Sign Up</button>}
                  </StyledAuthFooter>
                </form>
              </StyledAuthBody>
              <AuthGoogle />
            </StyledAuthContainer>
          )
        }
      }
    </AuthContext.Consumer>
  )
}

export default Auth
