import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

import AuthContext from '../context/auth-context'

import LabelContext from '../context/label-context'
import ContentWriting from './ContentWriting'

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

    const familyBlock = []
    resData.data.familyBlocks.forEach((e) => {
      familyBlock.push(e.label + e.content)
    })

    setFormValue(familyBlock.join())
  }

  useEffect(fetchFamilyBlocks)

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
              <div onClick={() => {
                setEdit(!edit)
              }}>{props.content}</div>
              { edit ? <ContentWriting>{formValue}</ContentWriting> : null}
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
  content: PropTypes.string
}

export default Content
