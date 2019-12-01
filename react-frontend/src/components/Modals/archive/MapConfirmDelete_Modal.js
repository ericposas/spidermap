import React from 'react'

const MapConfirmDelete_Modal = ({ ...props }) => {

  return (<div
    style={{
      display: 'block',
      position: 'absolute',
      backgroundColor: 'rgba(0,0,0,0.35)',
      filter: 'blur(1.5)',
      width: '100%',
      height: '100%',
      zIndex: 200,
    }}
    className='modal-confirm-delete-backing'>
    <div
      style={{
        display: 'block',
        position: 'absolute',
        width: '50%',
        height: '40%',
        margin: 'auto',
        left: 0, right: 0,
        top: 0, bottom: 0,
        backgroundColor: '#fff',
        borderRadius: '4px',
        zIndex: 201,
      }}
      className='modal-confirm-delete'>
        <div
          className='x-button'
          style={{
            float: 'right',
            marginTop: '-4px',
            marginRight: '-4px',
            transform: 'scale(1.35)',
          }}
          onClick={() => setConfirmDeleteModal(false)}>
          <div
            className='x-button-x-symbol'>
            x
          </div>
        </div>
      <div
        style={{
          display: 'block',
          position: 'absolute',
          width: '60%',
          height: '60%',
          margin: 'auto',
          top: 0, bottom: 0,
          left: 0, right: 0,
          textAlign: 'center',
        }}
       className='modal-confirm-yes-no-button-container'>
        <div>Are you sure that you want to delete this map? <span style={{opacity:0}}>{mapIdToDelete}</span></div>
        <br/>
        <button
        className='button-plain button-decline'
        onClick={() => setConfirmDeleteModal(false)} style={{ display:'inline-block' }}>Nevermind.</button>
        <span style={{ paddingRight: '10px' }}></span>
        <button
        className='button-plain button-confirm'
        onClick={crudDelete} style={{ display:'inline-block' }}>Confirm.</button>
      </div>
    </div>
  </div>)

}

export default MapConfirmDelete_Modal
