import React from 'react'
import '../../images/down-arrow.png'

const DropdownGraphicStyle = ({ ...props }) => {

  return (
    <div style={{ position: 'absolute' }}>
      <div style={{ display: 'inline-block', color: '#777', fontWeight: 'lighter' }}>{props.children}</div>&nbsp;&nbsp;
      <img src='./img/down-arrow.png' style={{ display: 'inline-block', width: '14px' }} />
      <div style={{ position: 'absolute', borderBottom: '1px solid #ccc', width: '100%' }}></div>
    </div>
  )

}

export default DropdownGraphicStyle
