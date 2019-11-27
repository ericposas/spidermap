import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { downloadPNG, downloadSVG } from '../../utils/downloadOptions'
import html2canvas from 'html2canvas'
import fileSaver from 'file-saver'
import html2pdf from 'html2pdf.js'
import '../Buttons/buttons.scss'
import {
  LISTVIEW_RENDERING,
  LISTVIEW_NOT_RENDERING,
} from '../../constants/listview'
import {
  DOWNLOADED_PDF,
  DOWNLOADING_PDF,
  SELECTED_FILE_TYPE,
} from '../../constants/constants'

const DownloadImagePanel = ({ ...props }) => {

  const { history, type } = props

  const dispatch = useDispatch()

  const [fileType, setFileType] = useState('SVG')

  const [resolution, setResolution] = useState(2)

  const handleDownload = () => {
    switch (fileType) {
      case 'PDF':
        downloadPDF()
        dispatch({ type: SELECTED_FILE_TYPE, payload: 'PDF' })
        break;
      case 'SVG':
        downloadSVG(type)
        dispatch({ type: SELECTED_FILE_TYPE, payload: 'SVG' })
        break;
      case 'PNG':
        if (type == 'listview') {
          downloadListviewPNG()
        } else {
          downloadPNG(type, resolution)
        }
        dispatch({ type: SELECTED_FILE_TYPE, payload: 'PNG' })
        break;
      default:
        downloadSVG()
    }
  }

  // var style = document.createElement('style')
  // style.innerHTML = 'font-family:arial;'
  // element.appendChild(style)
  const downloadPDF = () => {
    dispatch({ type: DOWNLOADING_PDF })
    var element = document.getElementsByClassName('pdf-content')[0]
    var opt = {
      filename: `${type}.pdf`,
      image:  { type: 'png', quality: 0.99 },
      html2canvas:  { scale: 2 },
      jsPDF:  { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    setTimeout(() => {
      html2pdf().set(opt)
                .from(element)
                .save()
                .then(() => dispatch({ type: DOWNLOADED_PDF }))
                .catch(err => console.log(err))
    }, 2000)
  }

  const downloadListviewPNG = () => {
    dispatch({ type: LISTVIEW_RENDERING })
    setTimeout(initRender, 2000)
    function initRender () {
      html2canvas(document.querySelector('#listview-content'), { letterRendering: true, allowTaint: true, useCORS: true })
          .then((canvas) => {
            console.log(canvas)
            saveAs(canvas.toDataURL(), 'listview.png')
            setTimeout(() => dispatch({ type: LISTVIEW_NOT_RENDERING }), 2000)
          })
    }
    function saveAs(uri, filename) {
      var link = document.createElement('a');
      if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;
        //Firefox requires the link to be in the body
        document.body.appendChild(link);
        //simulate click
        link.click();
        //remove the link when done
        document.body.removeChild(link);
      } else {
        window.open(uri);
      }
    }
  }

  useEffect(() => {
    if (type == 'listview') setFileType('PNG')
    window.onafterprint = null
    window.onafterprint = () => {
      dispatch({ type: NOT_PRINTING_LISTVIEW })
    }
  }, [])

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
            Export<br/>
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
              { type != 'listview' ? <option value='SVG'>SVG</option> : null }
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
