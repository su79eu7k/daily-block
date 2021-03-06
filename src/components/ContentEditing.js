import React, { useState, useContext, useRef } from 'react'
import PropTypes from 'prop-types'

import AuthContext from '../context/auth-context'
import LabelContext from '../context/label-context'

function ContentEditing (props) {
  const [submitError, setSubmitError] = useState(false)
  const auth = useContext(AuthContext)
  const editingEl = useRef(null)

  const editingHandler = async (event, labelContext) => {
    event.preventDefault()
    await props.deleteFamilyBlocks()

    let editing = editingEl.current.value.split(/^(#\s.+)$/m).slice(1)

    const labels = []
    const contents = []

    if (editing[0] === '') {
      editing = editing.slice(1)
    }

    if ((/^#\s.+$/m).test(editing[0])) {
      editing.forEach(function (item, index) {
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

    for (let index = 0; index < labels.length; index++) {
      const label = labels[index]
      const content = contents[index].replaceAll(/\n/g, '\\n')
      const sn = index

      const requestBody = {
        query: `
          mutation {
            createBlock(blockInput: {label: "${label}", content: """${content}""", date: ${props.date}, sn: ${sn}}) {
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
    }

    props.setEdit(false)
    props.setBlocksUpdated(false)

    if (labelContext.label !== '' && !labels.includes(labelContext.label)) {
      labelContext.changeLabel('')
    }
  }

  return (
    <LabelContext.Consumer>
      {
        (context) => {
          return (
            <div className='card--auth--container'>
              <div className='card--auth--header'>Edit</div>
              <div className='card--auth--body'>
              <form onSubmit={(e) => { editingHandler(e, context) }}>
                <div className='card--auth--body--elem'>
                  <label>Markdown</label>
                  <textarea ref={editingEl} defaultValue={props.children}></textarea>
                </div>
                <div className='card--auth--body--footer'>
                  <button onClick={() => props.setEdit(false)}>Cancel</button>
                  <input type="submit" value="Submit"></input>
                </div>
              </form>
              </div>
            </div>
          )
        }
      }
    </LabelContext.Consumer>
  )
}

ContentEditing.propTypes = {
  date: PropTypes.number,
  setBlocksUpdated: PropTypes.func,
  children: PropTypes.string,
  deleteFamilyBlocks: PropTypes.func,
  setEdit: PropTypes.func,
  edit: PropTypes.bool
}

export default ContentEditing
