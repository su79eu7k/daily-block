import React, { useState, useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import AuthContext from '../context/auth-context'

function ContentWriting (props) {
  const [submitError, setSubmitError] = useState(false)
  const auth = useContext(AuthContext)
  const writingEl = useRef(null)

  const writingHandler = (event) => {
    event.preventDefault()
    let writing = writingEl.current.value.split(/^(#\s.+)$/m)
    const familyTimeStamp = Date.now()

    console.log(writing)

    const labels = []
    const contents = []

    if (writing[0] === '') {
      writing = writing.slice(1)
    }

    if ((/^#\s.+$/m).test(writing[0])) {
      writing.forEach(function (item, index) {
        if (index % 2 === 0) {
          labels.push(item)
        } else {
          contents.push(item)
        }
      })
    } else {
      setSubmitError(true)
      console.log(submitError)
      return
    }

    labels.forEach(function (item, index) {
      const label = labels[index]
      const content = contents[index].replaceAll(/\n/g, '\\n')
      const date = familyTimeStamp

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
        props.setBlocksUpdated(false)
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
          <textarea ref={writingEl} defaultValue={props.children}></textarea>
        </div>
        <div>
          <input type="submit" value="Submit"></input>
        </div>
      </form>
    </div>
  )
}

ContentWriting.propTypes = {
  setBlocksUpdated: PropTypes.func,
  children: PropTypes.string
}

export default ContentWriting
