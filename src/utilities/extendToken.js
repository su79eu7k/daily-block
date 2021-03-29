function extendToken (authContext) {
  const query = `query {
    extendToken {
      token
    }
  }`

  fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      query
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + authContext.token
    }
  }).then(res => {
    return res.json()
  }).then(resData => {
    const auth = { token: resData.data.extendToken.token }
    authContext.login(...Object.values(auth))
    localStorage.setItem('auth', JSON.stringify(auth))
  }).catch(err => {
    console.log(err)
  })
}

export default extendToken
