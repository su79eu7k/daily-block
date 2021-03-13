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
      const sn = index

      const requestBody = {
        query: `
          mutation {
            createBlock(blockInput: {label: "${label}", content: """${content}""", date: ${date}, sn: ${sn}}) {
              label
              content
              date
              sn
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
      }).catch(err => {
        console.log(err)
      })
    })

    props.setWrite(false)
    props.setBlocksUpdated(false)
  }

  return (
    <div className='card--auth--container'>
      <div className='card--auth--body'>
        <form onSubmit={writingHandler}>
          <div className='card--auth--body--elem'>
            <label><a href='https://www.markdownguide.org/basic-syntax/' target='_blank' rel='noreferrer'>Markdown</a></label>
            <textarea ref={writingEl} defaultValue={props.children}></textarea>
          </div>
          <div className='card--auth--body--footer'>
            <button type="button" onClick={() => props.setWrite(false)}>Cancel</button>
            <input type="submit" value="Submit"></input>
          </div>
        </form>
      </div>
    </div>
  )
}

ContentWriting.propTypes = {
  setBlocksUpdated: PropTypes.func,
  children: PropTypes.string,
  setWrite: PropTypes.func
}

export default ContentWriting
