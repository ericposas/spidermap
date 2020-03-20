import React, { useState } from 'react'
import DropdownGraphicStyle from '../Dropdowns/DropdownGraphicStyle'
import arrow from '../../images/down-arrow.png'

const ChangeAllLabelsMenu = ({ ...props }) => {
  let labelText = 'Change all labels'
  const divRef = React.useRef()
  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        left: props.leftMargin ? props.leftMargin : 0,
        // left: (
        //   props.leftMargin && divRef && divRef.current
        //   ? getComputedStyle(divRef.current).getPropertyValue('width')
        //   : 0
        // ),
        // border: props.showChangeAllLabelsMenu ? '1px solid #999' : 'none', backgroundColor: '#fff',
        borderRadius: '2px', padding: '4px 10px 0 10px'
      }}>
      {
        props.showChangeAllLabelsMenu
        ?
          <div
            style={{
              cursor: 'pointer',
              // textDecoration: 'underline',
              backgroundColor: '#fff',
              fontSize: '1rem',
              // float: 'right'
            }}>
            <div
              onClick={() => props.setShowChangeAllLabelsMenu(false)}
              >
              <div
                style={{ display: 'inline-block' }}
                >
                {labelText}
              </div>
              <img
                src={arrow}
                style={{
                  display: 'inline-block', width: '14px',
                  transform: 'rotate(180deg)', marginTop: '-3px',
                  marginLeft: '8px'
                }}
                />
            </div>
          </div>
        :
          <div
            style={{
              // textDecoration: 'underline',
              backgroundColor: 'rgba(0,0,0,0)',
              cursor: 'pointer',
              fontSize: '1rem',
            }}>
            <div
              onClick={() => props.setShowChangeAllLabelsMenu(true)}
              >
              <div
                style={{ display: 'inline-block' }}
                >
                {labelText}
              </div>
              <img
                src={arrow}
                style={{
                  display: 'inline-block', width: '14px',
                  marginTop: '-3px', marginLeft: '8px'
                }}
                />
            </div>
          </div>
      }
      <div style={{ position: 'relative' }}>
        {
          props.showChangeAllLabelsMenu
          ?
          <>
            {/*<div style={{ color: '#555', fontWeight: 'lighter' }}>Change all labels</div>*/}
            <div style={{ display: 'inline-block' }}>
              <DropdownGraphicStyle>Position</DropdownGraphicStyle>
              <select
                style={{
                  opacity: '0.001', backgroundColor: '#fff', color: '#222'
                }}
                onChange={props.changeAllLabelPositions}>
                <option></option>
                <option value='right'>Right</option>
                <option value='top'>Top</option>
                <option value='bottom'>Bottom</option>
                <option value='left'>Left</option>
              </select>
            </div>
            <div style={{ display: 'inline-block', paddingLeft: '14px' }}>
              <DropdownGraphicStyle>Display</DropdownGraphicStyle>
              <select
                style={{
                  opacity: '0.001', backgroundColor: '#fff', color: '#222'
                }}
                onChange={props.changeAllLabelDisplayTypes}>
                <option></option>
                <option value='city-and-code'>City, Code</option>
                <option value='airport'>Airport</option>
                <option value='region'>Region</option>
                <option value='city'>City</option>
                <option value='code'>Code</option>
              </select>
            </div>
          </> : null
      }
      </div>
    </div>
  )

}

export default ChangeAllLabelsMenu
