import React, { useState, useContext, useCallback } from 'react'
import PropTypes from 'prop-types'

import ReactMarkdown from 'react-markdown'

import AuthContext from '../context/auth-context'
import LabelContext from '../context/label-context'
import ContentEditing from './ContentEditing'
import Modal from './Modal'

import { useTransition, animated } from 'react-spring'

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

  const fetchFormValue = async () => {
    const query = `
      query Blocks($familyIndex: [Float!], $label: String) {
        blocks(familyIndex: $familyIndex, label: $label) {
          label
          content
          date
        }
      }`

    const res = await fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        query,
        variables: { familyIndex: props.date, label: '' }
      }),
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
    resData.data.blocks.forEach((e) => {
      familyBlock.push(e.label + e.content)
    })

    setFormValue(familyBlock.join(''))
  }

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

    const res = await fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT, {
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

  const handleEdit = () => {
    if (edit === false) {
      fetchFormValue()
    }
    setEdit(!edit)
  }

  const handleDelete = () => {
    rejectScroll()
    setVisible(true)
  }

  const localeString = new Date(props.date).toLocaleString('en-US')

  const transitions = useTransition(edit, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })

  const date = props.date
  const setDeletedCount = props.setDeletedCount
  const setBlocksUpdated = props.setBlocksUpdated

  return (
    <LabelContext.Consumer>
      {
        (context) => {
          return (
            <div className='card--content--container'>
              {
                transitions.map(({ item, key, props }) => item &&
                  <animated.div key={key} style={props}>
                    <ContentEditing date={date} deleteFamilyBlocks={deleteFamilyBlocks} setDeletedCount={setDeletedCount} setBlocksUpdated={setBlocksUpdated} setEdit={setEdit} edit={edit}>{formValue}</ContentEditing>
                  </animated.div>
                )
              }
              { (context.currentLabel !== '' || (context.currentLabel === '' && props.sn === 0)) && <div className='card--content--info'>
                <div className='timestamp'>{localeString}</div>
                <ul>
                  <li><div className='icon-btn' onClick={() => { handleEdit() }}>Edit</div></li>
                  <li><div className='icon-btn' onClick={() => { handleDelete() }}>Delete</div></li>
                  <Modal visible={visible} setVisible={setVisible} deleteFamilyBlocks={deleteFamilyBlocks} allowScroll={allowScroll}></Modal>
                </ul>
              </div>}
              <div className='card--content--label' onClick={() => {
                context.currentLabel === props.label ? context.changeLabel('') : context.changeLabel(props.label)
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
  sn: PropTypes.number,
  setDeletedCount: PropTypes.func,
  setBlocksUpdated: PropTypes.func,
  blocksUpdated: PropTypes.bool
}

export default Content
