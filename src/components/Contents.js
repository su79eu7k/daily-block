import React, { useContext, useState, useRef } from 'react'
import AuthContext from '../context/auth-context'
import ContentsRolling from './ContentsRolling'

function ContentsWriting () {
  const auth = useContext(AuthContext)
  const [blocks, setBlocks] = useState([])
  const writingEl = useRef(null)

  const writingHandler = (event) => {
    event.preventDefault()
    const writing = writingEl.current.value.split(/^(#\s.+)/m).slice(1)

    const labels = []
    const contents = []
    // FIXME: If title is #Title, parsing fails.
    if (writing[0].includes('#')) {
      writing.forEach(function (item, index) {
        if (index % 2 === 0) {
          labels.push(item)
        } else {
          contents.push(item)
        }
      })
    } else {
      console.log('Found text out of the block!')
    }

    labels.forEach(function (item, index) {
      const label = labels[index]
      const content = contents[index]
      const date = Date.now()

      const requestBody = {
        query: `
          mutation {
            createBlock(blockInput: {label: "${label}", content: """${content}""", date: ${date}}) {
              label
              content
              date
            }
          }
        `
      }
      console.log(requestBody)
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
        setBlocks([...blocks, resData.data.createBlock])
      }).catch(err => {
        console.log(err)
      })
    })
  }

  return (
    <div>
      <h2>Writing</h2>
      <form onSubmit={writingHandler}>
        <div>
          <label>Markdown</label>
        </div>
        <div>
          <textarea ref={writingEl}></textarea>
        </div>
        <div>
          <input type="submit" value="Submit"></input>
        </div>
      </form>
      <ContentsRolling blocks={blocks} setBlocks={setBlocks}/>
    </div>
  )
}

export default ContentsWriting
