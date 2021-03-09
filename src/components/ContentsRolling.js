import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import AuthContext from '../context/auth-context'
import LabelContext from '../context/label-context'
import Content from './Content'
import Skeleton from './Skeleton'

function ContentsRolling (props) {
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(false)
  const [label, setLabel] = useState({
    currentLabel: '',
    changeLabel: (selectedLabel) => {
      setLabel({ ...label, currentLabel: selectedLabel })
    }
  })
  const [deletedCount, setDeletedCount] = useState(null)

  const auth = useContext(AuthContext)

  const fetchBlocks = () => {
    setLoading(true)
    const requestBody = {
      query: `
          query {
            blocks(label: "${label.currentLabel}") {
              _id
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
    }).then(resData => {
      if (resData.errors) {
        if (resData.errors[0].statusCode === 401) {
          auth.logout()
          return
        }
      }
      setLoading(false)
      setBlocks(resData.data.blocks)
      props.setBlocksUpdated(true)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(fetchBlocks, [label.currentLabel, props.blocksUpdated, deletedCount])

  return (
    <LabelContext.Provider value={label}>
      <div className='card--rolling--container'>
        {loading && new Array(3).fill(1).map((_, i) => { return <Skeleton key={i} /> })}
        {!loading && blocks.map((block) => { return <Content key={block._id} label={block.label} date={block.date} sn={block.sn} content={block.content} setDeletedCount={setDeletedCount} blocksUpdated={props.blocksUpdated} setBlocksUpdated={props.setBlocksUpdated} /> })}
      </div>
    </LabelContext.Provider>
  )
}

ContentsRolling.propTypes = {
  blocksUpdated: PropTypes.bool,
  setBlocksUpdated: PropTypes.func
}

export default ContentsRolling
