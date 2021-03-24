import React from 'react'
import GoogleLogin from 'react-google-login'
import authContext from '../context/auth-context'
const { OAuth2Client } = require('google-auth-library')

const clientId = '39791115826-6tis5pko251mrppnkuugsvkprpn6jqo6.apps.googleusercontent.com'
const client = new OAuth2Client(clientId)

function AuthGoogle () {
  const responseGoogle = async (resGoogle, authContext) => {
    const ticket = await client.verifyIdToken({
      idToken: resGoogle.tokenId,
      audience: clientId
    })
    const { name, email, picture } = ticket.getPayload()

    const query = `mutation AuthUserGoogle($name: String!, $email: String!, $picture: String!) {
      authUserGoogle(authUserGoogleInput: {name: $name, email: $email, picture: $picture}) {
        token
        userId
        tokenExpiration
      }
    }`

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query,
        variables: { name, email, picture }
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }).then(res => {
      return res.json()
    }).then(resData => {
      const resAuth = resData.data.authUserGoogle
      const auth = { token: resAuth.token, uesrId: resAuth.userId, tokenExpiration: resAuth.tokenExpiration }
      authContext.login(...Object.values(auth))
      localStorage.setItem('auth', JSON.stringify(auth))
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <authContext.Consumer>
      {
        (authContext) => {
          return (
            <GoogleLogin
              clientId="39791115826-6tis5pko251mrppnkuugsvkprpn6jqo6.apps.googleusercontent.com"
              buttonText="Sign in with Google"
              onSuccess={(resGoogle) => { responseGoogle(resGoogle, authContext) }}
              onFailure={responseGoogle}
              // cookiePolicy={'single_host_origin'}
            />
          )
        }
      }
    </authContext.Consumer>
  )
}

export default AuthGoogle
