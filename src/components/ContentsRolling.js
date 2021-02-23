import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import AuthContext from '../context/auth-context'
import LabelContext from '../context/label-context'
import Content from './Content'

function ContentsRolling (props) {
  const [blocks, setBlocks] = useState([])
  const [label, setLabel] = useState({
    currentLabel: '',
    changeLabel: (selectedLabel) => {
      setLabel({ ...label, currentLabel: selectedLabel })
    }
  })
  const [deletedCount, setDeletedCount] = useState(null)

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
      if (resData.errors[0].statusCode === 401) {
        auth.logout()
        return
      }

      setBlocks([...resData.data.blocks])
      props.setBlocksUpdated(true)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(fetchBlocks, [label.currentLabel, props.blocksUpdated, deletedCount])

  // FIXME: Rendering order should be fixed.
  return (
    <LabelContext.Provider value={label}>
      <div>
        <h2>Rolling</h2>
        {blocks.map((block, index) => {
          return <Content key={index} label={block.label} date={block.date} content={block.content} setDeletedCount={setDeletedCount} blocksUpdated={props.blocksUpdated} setBlocksUpdated={props.setBlocksUpdated} />
        })}
      </div>
    </LabelContext.Provider>
  )
}

ContentsRolling.propTypes = {
  blocksUpdated: PropTypes.bool,
  setBlocksUpdated: PropTypes.func
}

export default ContentsRolling
