import React, { useState, useContext, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import ReactMarkdown from 'react-markdown'

import AuthContext from '../context/auth-context'
import LabelContext from '../context/label-context'
import ContentEditing from './ContentEditing'
import Modal from './Modal'

function Content (props) {
  const [visible, setVisible] = useState(false)
  const [edit, setEdit] = useState(false)
  const [formValue, setFormValue] = useState(null)

  const auth = useContext(AuthContext)

  const handleTouchMove = useCallback((e) => {
    e.preventDefault()
  }, [])

  const rejectScroll = () => {
    document.body.style.overflow = 'hidden'
    document.body.addEventListener('touchmove', handleTouchMove, {
      capture: false,
      once: false,
      passive: false
    })
  }

  const allowScroll = () => {
    document.body.style.overflow = 'auto'
    document.body.removeEventListener('touchmove', handleTouchMove)
  }

  const handleDelete = () => {
    rejectScroll()
    setVisible(true)
  }

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

  const localeString = new Date(props.date).toLocaleString('en-US')

  return (
    <LabelContext.Consumer>
      {
        (context) => {
          return (
            <div className='card--content--container'>
              { edit ? <ContentEditing date={props.date} deleteFamilyBlocks={deleteFamilyBlocks} setDeletedCount={props.setDeletedCount} setBlocksUpdated={props.setBlocksUpdated} setEdit={setEdit} edit={edit}>{formValue}</ContentEditing> : null}
              {!props.isSibling && <div className='card--content--info'>
                <div className='timestamp'>{localeString}</div>
                <ul>
                  <li><div className='icon-btn' onClick={() => { setEdit(!edit) }}>Edit</div></li>
                  <li><div className='icon-btn' onClick={() => { handleDelete() }}>Delete</div></li>
                  <Modal visible={visible} setVisible={setVisible} deleteFamilyBlocks={deleteFamilyBlocks} allowScroll={allowScroll}></Modal>
                </ul>
              </div>}
              <div className='card--content--label' onClick={() => {
                props.label === context.currentLabel ? context.changeLabel('') : context.changeLabel(props.label)
              }}><h1>{props.label}</h1></div>
              <div className='card--content--content'>
                <ReactMarkdown>
                  {props.content.replaceAll('\\n', '\n')}
                </ReactMarkdown>
              </div>
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
  isSibling: PropTypes.bool,
  setDeletedCount: PropTypes.func,
  setBlocksUpdated: PropTypes.func,
  blocksUpdated: PropTypes.bool
}

export default Content
