import React, { useState } from 'react'

import ContentsRolling from './ContentsRolling'
import ContentWriting from './ContentWriting'

import AuthContext from '../context/auth-context'
import extendToken from '../utilities/extendToken'

import { useTransition, animated } from 'react-spring'
import styled from 'styled-components'

const StyledButton = styled.button`
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

function Contents () {
  const [write, setWrite] = useState(false)
  const [blocksUpdated, setBlocksUpdated] = useState(Date.now())

  const handleButtonClick = (authContext) => {
    setWrite(true)

    if (!write) {
      extendToken(authContext)
    }
  }

  const transitions = useTransition(write, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })

  return (
    <AuthContext.Consumer>
      {
        (authContext) => {
          return (
            <div className='card--contents--container'>
              <StyledButton write={write} type='button' onClick={() => handleButtonClick(authContext)}>New ✏️</StyledButton>
              {
                transitions.map(({ item, key, props }) => item &&
                  <animated.div key={key} style={props}>
                    <ContentWriting setWrite={setWrite} setBlocksUpdated={setBlocksUpdated} />
                  </animated.div>
                )
              }
              <ContentsRolling blocksUpdated={blocksUpdated} setBlocksUpdated={setBlocksUpdated} />
            </div>
          )
        }
      }
    </AuthContext.Consumer>
  )
}

export default Contents
