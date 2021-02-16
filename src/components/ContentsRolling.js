import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/auth-context'

function ContentsRolling () {
  const [blocks, setBlocks] = useState([])

  const auth = useContext(AuthContext)

  useEffect(() => {
    const requestBody = {
      query: `
        query {
          blocks(label: "") {
            _id
            label
            content
            date
          }
        }
      `
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      }
    }).then(res => {
      return res.json()
    }).then(resData => {
      setBlocks([...blocks, ...resData.data.blocks])
    }).catch(err => {
      console.log(err)
    })
  }, [])

  return (
    <div>
      <h2>Rolling</h2>
    </div>
  )
}

export default ContentsRolling
