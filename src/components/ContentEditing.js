import React, { useState, useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import AuthContext from '../context/auth-context'
import LabelContext from '../context/label-context'
import styled from 'styled-components'

const StyledWarning = styled.div`
  font-size: .8rem;
  text-align: center;
`

function ContentEditing (props) {
  const [submitError, setSubmitError] = useState(false)
  const auth = useContext(AuthContext)
  const editingEl = useRef(null)

  const editingHandler = async (event, labelContext) => {
    event.preventDefault()

    // If submit button pushed but actually nothing has been Changed...
    if (editingEl.current.value === props.children) {
      props.setEdit(false)
      return
    }

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
      return
    }

    await props.deleteFamilyBlocks()

    for (let index = 0; index < labels.length; index++) {
      const label = labels[index]
      const content = contents[index]
      const date = props.date
      const sn = index

      const query = `mutation CreateBlock($label: String!, $content: String!, $date: Float!, $sn: Int!) {
        createBlock(blockInput: {label: $label, content: $content, date: $date, sn: $sn}) {
          label
          content
          date
          sn
        }
      }`

      fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
          query,
          variables: { label, content, date, sn }
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      }).then(res => {
        return res.json()
      }).catch(err => {
        console.log(err)
      })
    }

    props.setEdit(false)
    props.setBlocksUpdated(Date.now())

    if (labelContext.label !== '' && !labels.includes(labelContext.label)) {
      labelContext.changeLabel('')
    }
  }

  return (
    <LabelContext.Consumer>
      {
        (context) => {
          return (
            <div className='card--io--container'>
              <div className='card--io--header'>Edit</div>
              <div className='card--io--body'>
              <form onSubmit={(e) => { editingHandler(e, context) }}>
                <div className='card--io--body--elem'>
                  <label><a href='https://www.markdownguide.org/basic-syntax/' target='_blank' rel='noreferrer'>Markdown</a></label>
                  <textarea ref={editingEl} defaultValue={props.children}></textarea>
                </div>
                {submitError && <StyledWarning>⚠️ Cannot recognize label. Please check the format: #⎵label↵</StyledWarning>}
                <div className='card--io--body--footer'>
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
