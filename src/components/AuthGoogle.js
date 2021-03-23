import React from 'react'
import GoogleLogin from 'react-google-login'

function AuthGoogle () {
  const responseGoogle = (response) => {
    console.log(response)
  }

  return (
    <GoogleLogin
      clientId="39791115826-6tis5pko251mrppnkuugsvkprpn6jqo6.apps.googleusercontent.com"
      buttonText="Sign in with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
    />
  )
}

export default AuthGoogle
