import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { downloadPNG, downloadSVG } from '../../utils/downloadOptions'
import '../Buttons/buttons.scss'

const DownloadImagePanel = ({ ...props }) => {

  const { type } = props

  const [fileType, setFileType] = useState('SVG')

  const [resolution, setResolution] = useState(2)

  const handleDownload = async () => {
    switch (fileType) {
      case 'SVG':
        downloadSVG(type)
        break;
      case 'PNG':
        downloadPNG(type, resolution)
        break;
      default:
        downloadSVG()
    }
  }

  return (<>
    <div
      className='col-med'
      style={{
        width:'200px',
        height:'100vh',
        backgroundColor: 'white',
        boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
      }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}>
        <div
          style={{
            margin: '50% 0 0 0',
            padding: '0 10% 0 15%',
          }}>
          <div className='map-type-title'>
            {props.label}
          </div>
          <div
            onClick={() => props.history.push(`/${type}`)}
            style={{
              cursor: 'pointer',
              color: '#006CC4',
            }}>
            Edit
          </div>
          <br/>
          <div
            className='download-file-selection-container'
            style={{
              position: 'absolute',
              bottom: '20%',
            }}>
            <div>Select file type:</div>
            <select
              onChange={e => setFileType(e.target.value)}>
              <option value='SVG'>SVG</option>
              <option value='PNG'>PNG</option>
              <option value='PDF'>PDF</option>
            </select>
            {
              fileType == 'PNG'
              ?
                (<>
                  <div>Select resolution:</div>
                  <select
                    defaultValue='2'
                    onChange={e => setResolution(e.target.value)}>
                    <option value='1'>1x</option>
                    <option value='2'>2x</option>
                    <option value='3'>3x</option>
                  </select>
                </>)
              : null
            }
            <br/>
            <br/>
            <button
              style={{
                height:'60px',
                width: '100%',
                padding: '0 20px 0 20px',
                margin: '0 0 10px 0',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: 'red',
                color: '#fff'
              }}
              className='download-button'
              onClick={handleDownload}>
              Download {fileType}
            </button>
          </div>
        </div>
      </div>
      <br/>
    </div>
  </>)

}

export default withRouter(DownloadImagePanel)
