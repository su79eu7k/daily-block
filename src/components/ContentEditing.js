import React, { useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import AuthContext from '../context/auth-context'

function ContentEditing (props) {
  const auth = useContext(AuthContext)
  const editingEl = useRef(null)

  const editingHandler = (event) => {
    event.preventDefault()

    props.deleteFamilyBlocks()

    const editing = editingEl.current.value.split(/^(#\s.+)/m).slice(1)
    const familyTimeStamp = Date.now()

    const labels = []
    const contents = []
    // FIXME: If title is #Title, parsing fails.
    if (editing[0].includes('#')) {
      editing.forEach(function (item, index) {
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
      <h2>Editing</h2>
      <form onSubmit={editingHandler}>
        <div>
          <label>Markdown</label>
        </div>
        <div>
          <textarea ref={editingEl} defaultValue={props.children}></textarea>
        </div>
        <div>
          <input type="submit" value="Submit"></input>
        </div>
      </form>
    </div>
  )
}

ContentEditing.propTypes = {
  setBlocksUpdated: PropTypes.func,
  children: PropTypes.string,
  deleteFamilyBlocks: PropTypes.func
}

export default ContentEditing
