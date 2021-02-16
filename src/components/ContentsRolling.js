import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/auth-context'
import ContentCard from '../components/ContentCard'

function ContentsRolling () {
  const [blocks, setBlocks] = useState([])
  const [label, setLabel] = useState('')

  const auth = useContext(AuthContext)

  useEffect(() => {
    const requestBody = {
      query: `
        query {
          blocks(label: "${label}") {
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

  console.log(setLabel)

  return (
    <div>
      <h2>Rolling</h2>
      {blocks.map((block, index) => {
        const localDateTimeString = new Date(block.date).toLocaleDateString('ko-kr') + ' ' + new Date(block.date).toLocaleTimeString('ko-kr')
        return <ContentCard key={index} label={block.label} date={localDateTimeString} content={block.content} />
      })}
    </div>
  )
}

export default ContentsRolling
