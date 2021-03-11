import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes, css } from 'styled-components'
import Portal from './Portal'

const fadeIn = keyframes`
  0% {
    opacity: 0
  }
  100% {
    opacity: 1
  }
`

const fadeOut = keyframes`
  0% {
    opacity: 1
  }
  100% {
    opacity: 0
  }
`

const ModalWrapper = styled.div`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  transition: visibility 1s linear;
  ${(props) => props.visible && css`animation: ${fadeIn} 1s`};
  ${(props) => !props.visible && css`animation: ${fadeOut} 1s`};
`

const ModalOverlay = styled.div`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  transition: visibility 1s linear;
  ${(props) => props.visible && css`animation: ${fadeIn} 1s`};
  ${(props) => !props.visible && css`animation: ${fadeOut} 1s`};
`

const ModalInner = styled.div`
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
  background-color: #f2f0ea;
  border-radius: .3rem;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  width: 180px;
  height: 120px;
  @media (min-width: 600px) {
    width: 240px;
    height: 160px;
    padding: 1.5rem;
    font-size: 16px;
  }
  padding: 1.5rem;
  font-size: 12px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`

const StyledButton = styled.button`
  height: 2rem;
  width: 4rem;
  margin: .3rem;
  border-width: 0px;
  border-radius: 1rem;
  background-color: #857e7a;
  font-family: inherit;
  font-size: .7rem;
  color: #ffffff;

  &:hover {
    background-color: #443c36;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`

function Modal (props) {
  const handleCancel = () => {
    props.allowScroll()
    props.setVisible(false)
  }

  const handleDelete = () => {
    props.allowScroll()
    props.deleteFamilyBlocks()
  }

  return (
    <Portal container='modal-root'>
      <ModalOverlay visible={props.visible} />
      <ModalWrapper visible={props.visible}>
        <ModalInner>
          <p>Are you sure you want to delete all sibling items...?</p>
          <div>
            <StyledButton onClick={() => { handleCancel() }}>Cancel</StyledButton>
            <StyledButton onClick={() => { handleDelete() }}>Delete</StyledButton>
          </div>
        </ModalInner>
      </ModalWrapper>
    </Portal>
  )
}

Modal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  deleteFamilyBlocks: PropTypes.func,
  allowScroll: PropTypes.func
}

export default Modal
