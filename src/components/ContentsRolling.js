import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import AuthContext from '../context/auth-context'
import LabelContext from '../context/label-context'
import Content from './Content'

function ContentsRolling (props) {
  // const [blocks, setBlocks] = useState([])
  const [label, setLabel] = useState({
    currentLabel: '',
    changeLabel: (selectedLabel) => {
      setLabel({ ...label, currentLabel: selectedLabel })
    }
  })

  const auth = useContext(AuthContext)

  const fetchBlocks = () => {
    const requestBody = {
      query: `
        query {
          blocks(label: "${label.currentLabel}") {
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
      props.setBlocks([...resData.data.blocks])
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(fetchBlocks, [label.currentLabel])

  return (
    <LabelContext.Provider value={label}>
      <div>
        <h2>Rolling</h2>
        {props.blocks.map((block, index) => {
          const localDateTimeString = new Date(block.date).toLocaleDateString('ko-kr') + ' ' + new Date(block.date).toLocaleTimeString('ko-kr')
          return <Content key={index} label={block.label} date={localDateTimeString} content={block.content} />
        })}
      </div>
    </LabelContext.Provider>
  )
}

ContentsRolling.propTypes = {
  blocks: PropTypes.array,
  setBlocks: PropTypes.func
}
export default ContentsRolling
