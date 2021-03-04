import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Portal from './Portal'

const ModalOverlay = styled.div`
  display: ${(props) => props.visible ? 'block' : 'none'};
  box-sizing: border-box;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`

function Modal (props) {
  return (
    <Portal container='modal-root'>
      <ModalOverlay visible={props.visible} />
    </Portal>
  )
}

Modal.propTypes = {
  visible: PropTypes.bool
}

export default Modal
