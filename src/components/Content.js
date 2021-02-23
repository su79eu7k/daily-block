import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

import AuthContext from '../context/auth-context'

import LabelContext from '../context/label-context'
import ContentEditing from './ContentEditing'

function Content (props) {
  const [edit, setEdit] = useState(false)
  const [formValue, setFormValue] = useState(null)

  const auth = useContext(AuthContext)

  const fetchFamilyBlocks = async () => {
    const requestBody = {
      query: `
        query {
          familyBlocks(date: ${props.date}) {
            label
            content
            date
          }
        }
      `
    }

    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      }
    })
    const resData = await res.json()

    if (resData.errors) {
      if (resData.errors[0].statusCode === 401) {
        auth.logout()
        return
      }
    }

    const familyBlock = []
    resData.data.familyBlocks.forEach((e) => {
      familyBlock.push(e.label + e.content)
    })

    setFormValue(familyBlock.join('').replaceAll('\\n', '\n'))
  }

  useEffect(fetchFamilyBlocks, [props.blocksUpdated])

  const deleteFamilyBlocks = async () => {
    const requestBody = {
      query: `
        mutation {
          deleteFamilyBlocks(date: ${props.date}) {
            deletedCount
          }
        }
      `
    }

    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      }
    })
    const resData = await res.json()

    props.setDeletedCount(resData.data.deleteFamilyBlocks.deletedCount)
  }

  const localDateTimeString = new Date(props.date).toLocaleDateString('ko-kr') + ' ' + new Date(props.date).toLocaleTimeString('ko-kr')

  return (
    <LabelContext.Consumer>
      {
        (context) => {
          return (
            <div>
              <div onClick={() => {
                props.label === context.currentLabel ? context.changeLabel('') : context.changeLabel(props.label)
              }}>{props.label}</div>
              <div>{localDateTimeString}</div>
              <div><button onClick={() => { setEdit(!edit) }}>Edit</button></div>
              <div><button onClick={() => { deleteFamilyBlocks() }}>Delete</button></div>
              <div>{props.content.replaceAll('\\n', '\n')}</div>
              { edit ? <ContentEditing deleteFamilyBlocks={deleteFamilyBlocks} setDeletedCount={props.setDeletedCount} setBlocksUpdated={props.setBlocksUpdated} setEdit={setEdit} edit={edit}>{formValue}</ContentEditing> : null}
            </div>
          )
        }
      }
    </LabelContext.Consumer>
  )
}

Content.propTypes = {
  label: PropTypes.string,
  date: PropTypes.number,
  content: PropTypes.string,
  setDeletedCount: PropTypes.func,
  setBlocksUpdated: PropTypes.func,
  blocksUpdated: PropTypes.bool
}

export default Content
