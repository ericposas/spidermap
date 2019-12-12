import React, { useState } from 'react'

const ChangeAllLabelsMenu = ({ ...props }) => {

  const [showChangeAllLabelsMenu, setShowChangeAllLabelsMenu] = useState(false)

  return (
    <div style={{
        position: 'absolute', right: 0,
        border: showChangeAllLabelsMenu ? '1px solid #999' : 'none', backgroundColor: '#fff',
        borderRadius: '2px', padding: '4px'
      }}>
      {
        showChangeAllLabelsMenu
        ?
          <div
            onClick={() => setShowChangeAllLabelsMenu(false)}
            style={{
              textDecoration: 'underline', cursor: 'pointer',
              backgroundColor: '#fff', fontSize: '.6rem',
              float: 'right'
            }}>
            <div>collapse menu</div>
          </div>
        :
          <div
            onClick={() => setShowChangeAllLabelsMenu(true)}
            style={{
              textDecoration: 'underline', cursor: 'pointer',
              backgroundColor: '#fff', fontSize: '.6rem',
            }}>
            <div>change all labels</div>
          </div>
      }
      <div style={{ display: 'inline-block', position: 'relative' }}>
        {
          showChangeAllLabelsMenu
          ?
          <>
            <div>Change all labels</div>
            <div style={{ display: 'inline-block' }}>
              <div>Position</div>
              <select
                onChange={props.changeAllLabelPositions}>
                <option value='right'>Right</option>
                <option value='top'>Top</option>
                <option value='bottom'>Bottom</option>
                <option value='left'>Left</option>
              </select>
            </div>
            <div style={{ display: 'inline-block' }}>
              <div>Display</div>
              <select
                onChange={props.changeAllLabelDisplayTypes}>
                <option value='city-and-code'>City, Code</option>
                <option value='full'>Full</option>
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
