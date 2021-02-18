import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

import AuthContext from '../context/auth-context'

import LabelContext from '../context/label-context'
import ContentWriting from './ContentWriting'

function Content (props) {
  const [edit, setEdit] = useState(false)
  const auth = useContext(AuthContext)

  const fetchFamilyBlocks = () => {
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
      // TODO: Return original string.
      console.log(resData)
    }).catch(err => {
      console.log(err)
    })
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
              <div onClick={() => {
                setEdit(!edit)
              }}>{props.content}</div>
              { edit ? <ContentWriting>{ fetchFamilyBlocks() }</ContentWriting> : null }
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
