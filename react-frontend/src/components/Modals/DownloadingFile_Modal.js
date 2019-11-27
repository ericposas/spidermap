import React from 'react'
import { useSelector } from 'react-redux'

const DownloadingFile_Modal = ({ ...props }) => {

  const selectedFileType = useSelector(state => state.exportFileType)

  return (<>
    <div
      style={{
        zIndex: '250',
        width: '100%',
        position: 'absolute',
        height: innerHeight + 'px',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}></div>
    <div
      className='modal-downloading-file'
      style={{
        zIndex: '300',
        width: '30%',
        height: `${innerWidth * .1}px`,
        borderRadius: '4px',
        backgroundColor: '#fff',
        position: 'absolute',
        margin: 'auto',
        top: 0, bottom: 0,
        left: 0, right: 0,
        border: '1px solid #ccc',
        boxShadow: '10px 0 10px 0 rgba(0,0,0,0.2)'
      }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}>
        <div
          className='modal-downloading-file-inner'
          style={{
            textAlign: 'center',
            width: '50%',
            height: '100px',
            position: 'absolute',
            top: 0, bottom: 0,
            left: 0, right: 0,
            margin: 'auto',
          }}>
          Downloading {selectedFileType}...
        </div>
      </div>
    </div>
  </>)

}

export default DownloadingFile_Modal
