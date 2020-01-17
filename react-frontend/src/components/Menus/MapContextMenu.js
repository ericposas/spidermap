import React from 'react'
import { useDispatch } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

const MapContextMenu = ({ ...props }) => {

  const dispatch = useDispatch()

  return (
    <CSSTransition
      unmountOnExit
      in={props.showContextMenu}
      timeout={300}
      classNames='alert'>
    <div
    className='context-menu-container'
    style={{
      transform: `translateX(${props.contextMenuPosition.x+'px'}) translateY(${props.contextMenuPosition.y+'px'})`,
    }}>
    <div
      className='context-menu-x-button'
      onClick={() => props.setShowContextMenu(false)}
      style={{
        position: 'absolute',
        top: 0, right: '4px',
        cursor: 'pointer',
      }}>
      &#10006;
    </div>
    <div className='context-menu-title'>
      {props.contextMenuProps.title}: Context Menu
    </div>
    <div
      className='context-menu-item-list'>
      <div className='context-menu-label-position-type-title'>Set Label Position</div>
      <div className='context-menu-label-position-type-option'
        onClick={
        () => dispatch({ type: props.labelPositionAction, which: props.contextMenuProps.title, position: 'top' })
      }>Top</div>
    <div className='context-menu-label-position-type-option'
      onClick={
        () => dispatch({ type: props.labelPositionAction, which: props.contextMenuProps.title, position: 'right' })
      }>Right</div>
    <div className='context-menu-label-position-type-option'
      onClick={
        () => dispatch({ type: props.labelPositionAction, which: props.contextMenuProps.title, position: 'bottom' })
      }>Bottom</div>
    <div className='context-menu-label-position-type-option'
      onClick={
        () => dispatch({ type: props.labelPositionAction, which: props.contextMenuProps.title, position: 'left' })
      }>Left</div>
    <div className='context-menu-label-display-type-title'>Set Label Display Type</div>
    <div className='context-menu-label-display-type-option'
      onClick={
        () => {
          dispatch({ type: props.labelDisplayTypeAction, which: props.contextMenuProps.title, displayType: 'airport' })
          props.setShowContextMenu(false)
          setTimeout(() => props.setShowContextMenu(true), 5)
        }
      }>Airport</div>
    <div className='context-menu-label-display-type-option'
      onClick={
        () => {
          dispatch({ type: props.labelDisplayTypeAction, which: props.contextMenuProps.title, displayType: 'region' })
          props.setShowContextMenu(false)
          setTimeout(() => props.setShowContextMenu(true), 5)
        }
      }>Region</div>
    <div className='context-menu-label-display-type-option'
      onClick={
        () => {
          dispatch({ type: props.labelDisplayTypeAction, which: props.contextMenuProps.title, displayType: 'city' })
          props.setShowContextMenu(false)
          setTimeout(() => props.setShowContextMenu(true), 5)
        }
      }>City</div>
    <div className='context-menu-label-display-type-option'
      onClick={
        () => {
          dispatch({ type: props.labelDisplayTypeAction, which: props.contextMenuProps.title, displayType: 'code' })
          props.setShowContextMenu(false)
          setTimeout(() => props.setShowContextMenu(true), 5)
        }
      }>Code</div>
    <div className='context-menu-label-display-type-option'
      onClick={
        () => {
          dispatch({ type: props.labelDisplayTypeAction, which: props.contextMenuProps.title, displayType: 'city-and-code' })
          props.setShowContextMenu(false)
          setTimeout(() => props.setShowContextMenu(true), 5)
        }
      }>City, Code</div>
    </div>
  </div>
  </CSSTransition>
  )

}

export default MapContextMenu
