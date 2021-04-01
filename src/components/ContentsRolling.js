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

  const fetchFamilyIndex = async () => {
    const query = `query {
      familyIndex {
        distinct
      }
    }`

    const res = await fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        query
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
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

    return resData.data.familyIndex.distinct
  }

  const fetchBlocks = async () => {
    setLoading(true)

    const currentLabel = label.currentLabel
    let currentFamilies
    if (currentLabel === '') {
      const distinct = await fetchFamilyIndex()
      currentFamilies = distinct
    }

    const query = `
      query Blocks($familyIndex: [Float!], $label: String) {
        blocks(familyIndex: $familyIndex, label: $label) {
          _id
          label
          content
          date
          sn
        }
      }`

    const res = await fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        query,
        variables: { familyIndex: currentFamilies, label: currentLabel }
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
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

    setBlocks(resData.data.blocks)
    setLoading(false)
  }

  useEffect(fetchBlocks, [label.currentLabel, props.blocksUpdated, deletedCount])

  return (
    <LabelContext.Provider value={label}>
      <div className='card--rolling--container'>
        {
          label.currentLabel !== ''
            ? <div className='card--content--container'><div className='card--content--label--title' onClick={() => { label.changeLabel('') }}><h1>{label.currentLabel}</h1></div></div>
            : null
        }
        {loading && new Array(3).fill(1).map((_, i) => { return <Skeleton key={i} currentLabel={label.currentLabel} /> })}
        {!loading && blocks.map((block) => { return <Content key={block._id} label={block.label} date={block.date} sn={block.sn} content={block.content} setDeletedCount={setDeletedCount} blocksUpdated={props.blocksUpdated} setBlocksUpdated={props.setBlocksUpdated} /> })}
      </div>
    </LabelContext.Provider>
  )
}

ContentsRolling.propTypes = {
  blocksUpdated: PropTypes.number,
  setBlocksUpdated: PropTypes.func
}

export default ContentsRolling
