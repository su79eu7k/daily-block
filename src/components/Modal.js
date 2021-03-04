import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Portal from './Portal'

const ModalWrapper = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
`

const ModalOverlay = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
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
  height: 180px;
  @media (min-width: 600px) {
    width: 240px;
    height: 200px;
    padding: 1.5rem;
    font-size: 16px;
  }
  padding: 1.5rem;
  font-size: 12px;
`

function Modal (props) {
  return (
    <Portal container='modal-root'>
      <ModalOverlay visible={props.visible} />
      <ModalWrapper visible={props.visible}>
        <ModalInner>
          <p>Sibling articles of this day will be deleted as well...!</p>
          <p>Are you sure about this?</p>
        </ModalInner>
      </ModalWrapper>
    </Portal>
  )
}

Modal.propTypes = {
  visible: PropTypes.bool
}

export default Modal
