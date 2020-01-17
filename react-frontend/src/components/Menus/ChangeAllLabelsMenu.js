import React, { useState } from 'react'
import DropdownGraphicStyle from '../Dropdowns/DropdownGraphicStyle'

const ChangeAllLabelsMenu = ({ ...props }) => {

  return (
    <div style={{
        position: 'absolute', right: 0,
        border: props.showChangeAllLabelsMenu ? '1px solid #999' : 'none', backgroundColor: '#fff',
        borderRadius: '2px', padding: '4px 10px 0 10px'
      }}>
      {
        props.showChangeAllLabelsMenu
        ?
          <div
            onClick={() => props.setShowChangeAllLabelsMenu(false)}
            style={{
              textDecoration: 'underline', cursor: 'pointer',
              backgroundColor: '#fff', fontSize: '.6rem',
              float: 'right'
            }}>
            <div>collapse menu</div>
          </div>
        :
          <div
            onClick={() => props.setShowChangeAllLabelsMenu(true)}
            style={{
              textDecoration: 'underline', cursor: 'pointer',
              backgroundColor: '#fff', fontSize: '.6rem',
            }}>
            <div>change all labels</div>
          </div>
      }
      <div style={{ display: 'inline-block', position: 'relative' }}>
        {
          props.showChangeAllLabelsMenu
          ?
          <>
            <div style={{ color: '#555', fontWeight: 'lighter' }}>Change all labels</div>
            <div style={{ display: 'inline-block', marginRight: '20px' }}>
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
            <div style={{ display: 'inline-block' }}>
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
