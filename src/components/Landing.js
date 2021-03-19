import { NavLink } from 'react-router-dom'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useSpring, useTransition, animated } from 'react-spring'
import styled from 'styled-components'

const StyledButton = styled(animated.button)`
  margin-top: 3vh;
  height: 3rem;
  width: 240px;
  padding: 0px;
  border-width: 0px;
  border-radius: .3rem;
  background-color: ${props => props.write ? '#857e7a' : '#443c36'};
  font-family: inherit;
  font-size: 1rem;
  color: #ffffff;

  &:hover {
    cursor: pointer;
    background-color: #857e7a;
  }

  &:focus {
    outline: none;
  }

  @media (min-width: 600px) {
    width: 480px;
  }

  @media (min-width: 900px) {
    width: 720px;
  }
`

const StyledContainer = styled.div`
  font-size: 2rem;
  text-align: center;
`
const StyledWrapperMain = styled(animated.div)`
  margin: 3rem 0rem 1.5rem 0rem;
  padding: 3rem 0rem 1.5rem 0rem;
`
const StyledWrapperEx = styled(animated.div)`
  margin: 1.5rem 0rem 3rem 0rem;
  padding: 1.5rem 0rem 3rem 0rem;
`
const StyledMain = styled(animated.div)`
  height: auto;
`
const StyledEx = styled(animated.div)`
  height: auto;
  font-size: ${(props) => (props.id.charAt(0) === 'd' ? '1.3rem' : '1.5rem')};
  color: ${(props) => (props.id.charAt(0) === 'd' ? '#857e7a' : '#443c36')};
`

export default function App () {
  const refMain = useRef([])
  const refEx = useRef([])

  const [itemsMain, setItemsMain] = useState([])
  const [itemsEx, setItemsEx] = useState([])
  const [btnStart, setBtnStart] = useState(false)

  const transitMain = useTransition(itemsMain, (item) => item.k, {
    config: { mass: 1, tension: 210, friction: 20 },
    from: { opacity: 0, maxHeight: '0rem', color: '#443c36' },
    enter: [{ opacity: 1, maxHeight: '3rem', color: '#443c36' }, { color: '#857e7a' }],
    leave: { opacity: 0, maxHeight: '0rem', color: '#443c36' },
    update: {}
  })
  const transitEx = useTransition(itemsEx, (item) => item.k, {
    config: { mass: 1, tension: 210, friction: 20 },
    from: { opacity: 0, maxHeight: '0rem' },
    enter: { opacity: 1, maxHeight: '2.4rem' },
    leave: { opacity: 0, maxHeight: '0rem' },
    update: {}
  })
  const sprBtnStart = useSpring({ opacity: btnStart ? 1 : 0 })

  const resetMain = useCallback(() => {
    refMain.current.map(clearTimeout)
    refMain.current = []
    setItemsMain([])
    refMain.current.push(
      setTimeout(() => setItemsMain({ k: 'm0', v: 'LIFE🤗🍺' }), 1000)
    )
    refMain.current.push(
      setTimeout(() => setItemsMain([{ k: 'm0', v: 'LIFE🤗🍺' }, { k: 'm1', v: 'IDEA💡✨' }]), 3000)
    )
    refMain.current.push(
      setTimeout(
        () => setItemsMain([{ k: 'm0', v: 'LIFE🤗🍺' }, { k: 'm1', v: 'IDEA💡✨' }, { k: 'm2', v: 'Anything to log📈💸' }]),
        5000
      )
    )
    refMain.current.push(
      setTimeout(
        () => setItemsMain([{ k: 'm3', v: 'Write it down✏️📒' }]),
        7000
      )
    )
    refMain.current.push(
      setTimeout(
        () => setItemsMain([{ k: 'm4', v: 'And track them well🔎🏷️' }]),
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
            { k: 'e1', v: '# AAPL📈' },
            { k: 'e2', v: '# EATING🍽️' }
          ]),
        7000
      )
    )
    refEx.current.push(
      setTimeout(
        () =>
          setItemsEx([
            { k: 'd1', v: 'Tue.' },
            { k: 'e3', v: '# EATING🍽️' },
            { k: 'e4', v: '# MSFT' },
            { k: 'e5', v: '# LOVE❤️' }
          ]),
        9000
      )
    )
    refEx.current.push(
      setTimeout(
        () =>
          setItemsEx([
            { k: 'd2', v: 'Wed.' },
            { k: 'e6', v: '# AAPL📈' },
            { k: 'e7', v: '# LOVE❤️' },
            { k: 'e8', v: '# EATING🍽️' }
          ]),
        11000
      )
    )
    refEx.current.push(
      setTimeout(
        () =>
          setItemsEx([
            { k: 'l0', v: '# EATING🍽️' },
            { k: 'd0', v: 'Wed.' },
            { k: 'd1', v: 'Tue.' },
            { k: 'd2', v: 'Mon.' }
          ]),
        14000
      )
    )
    refEx.current.push(
      setTimeout(
        () =>
          setItemsEx([
            { k: 'l1', v: '# AAPL📈' },
            { k: 'd3', v: 'Wed.' },
            { k: 'd4', v: 'Mon.' }
          ]),
        16000
      )
    )
    refEx.current.push(
      setTimeout(
        () =>
          setItemsEx([
            { k: 'l2', v: '# LOVE❤️' },
            { k: 'd5', v: 'Wed.' },
            { k: 'd6', v: 'Tue.' }
          ]),
        18000
      )
    )
  }, [])

  useEffect(() => resetEx(), [])

  useEffect(() => { setTimeout(() => { setBtnStart(true) }, 20000) }, [])

  return (
    <StyledContainer>
      <StyledWrapperMain>
        {transitMain.map(({ item, key, props }) => (
          <StyledMain id={item.k} key={key} style={props}>
            {item.v}
          </StyledMain>
        ))}
      </StyledWrapperMain>
      <StyledWrapperEx>
        {transitEx.map(({ item, key, props }) => (
          <StyledEx id={item.k} key={key} style={props}>
            {item.v}
          </StyledEx>
        ))}
      </StyledWrapperEx>
      <NavLink to='/login'>
        <StyledButton style={sprBtnStart}>Start 🔌</StyledButton>
      </NavLink>
    </StyledContainer>
  )
}
