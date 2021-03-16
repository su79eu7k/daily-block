import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useTransition, animated } from 'react-spring'
// import styled from 'styled-components'

export default function App () {
  const refMain = useRef([])
  const refEx = useRef([])
  const [itemsMain, setItemsMain] = useState([])
  const [itemsEx, setItemsEx] = useState([])
  const transitMain = useTransition(itemsMain, (item) => item.k, {
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: 20 },
    leave: { opacity: 0, height: 0 },
    update: {}
  })
  const transitEx = useTransition(itemsEx, (item) => item.k, {
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: 20 },
    leave: { opacity: 0, height: 0 },
    update: {}
  })

  const resetMain = useCallback(() => {
    refMain.current.map(clearTimeout)
    refMain.current = []
    setItemsMain([])
    refMain.current.push(
      setTimeout(() => setItemsMain({ k: 'm0', v: 'Your life 🤗🍺' }), 1000)
    )
    refMain.current.push(
      setTimeout(() => setItemsMain({ k: 'm1', v: 'Your idea 💡✨' }), 3000)
    )
    refMain.current.push(
      setTimeout(() => setItemsMain({ k: 'm2', v: 'Or anything 📈💸' }), 5000)
    )
    refMain.current.push(
      setTimeout(
        () => setItemsMain([{ k: 'm3', v: 'Write it down ✏️📒' }]),
        7000
      )
    )
    refMain.current.push(
      setTimeout(
        () => setItemsMain([{ k: 'm4', v: 'And track them well 🔎🏷️' }]),
        14000
      )
    )
  }, [])

  useEffect(() => resetMain(), [])

  const resetEx = useCallback(() => {
    refEx.current.map(clearTimeout)
    refEx.current = []
    setItemsEx([])
    refEx.current.push(
      setTimeout(
        () =>
          setItemsEx([
            { k: 'd0', v: 'Mon.' },
            { k: 'e0', v: '# IDEA' },
            { k: 'e1', v: '# AAPL' },
            { k: 'e2', v: '# EATING' }
          ]),
        7000
      )
    )
    refEx.current.push(
      setTimeout(
        () =>
          setItemsEx([
            { k: 'd1', v: 'Tue.' },
            { k: 'e3', v: '# EATING' },
            { k: 'e4', v: '# AAPL' },
            { k: 'e5', v: '# LOVE' }
          ]),
        9000
      )
    )
    refEx.current.push(
      setTimeout(
        () =>
          setItemsEx([
            { k: 'd2', v: 'Wed.' },
            { k: 'e6', v: '# AAPL' },
            { k: 'e7', v: '# LOVE' },
            { k: 'e8', v: '# EATING' }
          ]),
        11000
      )
    )
    refEx.current.push(
      setTimeout(
        () =>
          setItemsEx([
            { k: 'l0', v: '# EATING' },
            { k: 'ld0', v: 'Wed.' },
            { k: 'ld1', v: 'Tue.' },
            { k: 'ld2', v: 'Mon.' }
          ]),
        14000
      )
    )
    refEx.current.push(
      setTimeout(
        () =>
          setItemsEx([
            { k: 'l1', v: '# AAPL' },
            { k: 'ld3', v: 'Wed.' },
            { k: 'ld4', v: 'Tue.' },
            { k: 'ld5', v: 'Mon.' }
          ]),
        16000
      )
    )
    refEx.current.push(
      setTimeout(
        () =>
          setItemsEx([
            { k: 'l2', v: '# LOVE' },
            { k: 'ld6', v: 'Wed.' },
            { k: 'ld7', v: 'Tue.' }
          ]),
        18000
      )
    )
  }, [])

  useEffect(() => resetEx(), [])

  return (
    <>
      <div>
        {transitMain.map(({ item, key, props }) => (
          <animated.div key={key} style={props} onClick={resetMain}>
            {item.v}
          </animated.div>
        ))}
      </div>
      <div>
        {transitEx.map(({ item, key, props }) => (
          <animated.div key={key} style={props} onClick={resetEx}>
            {item.v}
          </animated.div>
        ))}
      </div>
    </>
  )
}
