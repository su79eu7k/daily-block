import React from 'react'
import GoogleLogin from 'react-google-login'

function AuthGoogle () {
  const responseGoogle = (response) => {
    console.log(response)
  }

  return (
    <GoogleLogin
      clientId="clientId"
      buttonText="Login"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
    />
  )
}

export default AuthGoogle
