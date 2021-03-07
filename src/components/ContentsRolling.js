import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import AuthContext from '../context/auth-context'
import LabelContext from '../context/label-context'
import Content from './Content'

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
    setTimeout(() => {
      const requestBody = {
        query: `
          query {
            blocks(label: "${label.currentLabel}") {
              _id
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
        if (resData.errors) {
          if (resData.errors[0].statusCode === 401) {
            auth.logout()
            return
          }
        }

        // TODO: This logic could be deleted because now we have serial number.
        const blocks = resData.data.blocks
        const blocksWithSiblingRemark = []
        let lastElemTimeStamp = null
        blocks.forEach(elem => {
          if (elem.date === lastElemTimeStamp) {
            elem.isSibling = true
          } else {
            elem.isSibling = false
          }
          blocksWithSiblingRemark.push(elem)
          lastElemTimeStamp = elem.date
        })
        setLoading(false)
        setBlocks(blocksWithSiblingRemark)
        props.setBlocksUpdated(true)
      }).catch(err => {
        console.log(err)
      })
    }, 3000)
  }

  useEffect(fetchBlocks, [label.currentLabel, props.blocksUpdated, deletedCount])

  return (
    <LabelContext.Provider value={label}>
      <div className='card--rolling--container'>
        { loading && <h1>Loading...</h1> }
        { !loading && blocks.map((block) => { return <Content key={block._id} label={block.label} date={block.date} content={block.content} isSibling={block.isSibling} setDeletedCount={setDeletedCount} blocksUpdated={props.blocksUpdated} setBlocksUpdated={props.setBlocksUpdated} /> }) }
      </div>
    </LabelContext.Provider>
  )
}

ContentsRolling.propTypes = {
  blocksUpdated: PropTypes.bool,
  setBlocksUpdated: PropTypes.func
}

export default ContentsRolling
