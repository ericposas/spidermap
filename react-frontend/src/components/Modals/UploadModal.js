import React, { useRef, useEffect, useState } from 'react'
import UploadForm from '../Forms/UploadForm'

const UploadModal = ({ ...props }) => {

  return (
    <div
        className='modal-shadow-box'
        style={{
            top: 0,
            width:'100%',
            height:'100%',
            position:'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}>
      <div className='modal-inner-box'
           style={{
             margin: 'auto',
             top: 0, bottom: 0,
             left: 0, right: 0,
             position: 'absolute',
             width: innerWidth * .5 + 'px',
             height: innerHeight * .5 + 'px',
             backgroundColor: '#fff',
             borderRadius: '1px',
             boxShadow: '2px 2px 15px 2px rgba(0, 0, 0, 0.15)'
           }}>
        <UploadForm setModalVisibility={props.setModalVisibility} type={props.type}/>
      </div>
    </div>
  )

}

export default UploadModal
