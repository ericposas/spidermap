import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { withRouter } from 'react-router-dom'
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
  LAST_LOCATION,
  SAVING_FILE,
  FILE_SAVED,
  HIDE_FILE_SAVE_NOTIFICATION,
  DISPLAY_MAP_BG,
  HIDE_MAP_BG,
} from '../../constants/constants'
import { checkAuth, getUser } from '../../sessionStore'
import '../../images/save.svg'
import '../Pages/my-maps.scss'
import axios from 'axios'

const DownloadImagePanel = ({ ...props }) => {

  const { history, type } = props

  const dispatch = useDispatch()

  const [fileType, setFileType] = useState('SVG')

  const [resolution, setResolution] = useState(2)

  const selectedOriginListView = useSelector(state => state.selectedOriginListView)

  const selectedDestinationsListView = useSelector(state => state.selectedDestinationsListView)

  const selectedOriginSpidermap = useSelector(state => state.selectedOriginSpidermap)

  const selectedDestinationsSpidermap = useSelector(state => state.selectedDestinationsSpidermap)

  const selectedOriginsPointmap = useSelector(state => state.selectedOriginsPointmap)

  const selectedDestinationsPointmap = useSelector(state => state.selectedDestinationsPointmap)

  const savingFile = useSelector(state => state.savingFile)

  const pointmap_labelPositions = useSelector(state => state.pointmap_labelPositions)

  const pointmap_labelDisplayTypes = useSelector(state => state.pointmap_labelDisplayTypes)

  const spidermap_labelPositions = useSelector(state => state.spidermap_labelPositions)

  const spidermap_labelDisplayTypes = useSelector(state => state.spidermap_labelDisplayTypes)

  const [savingMapToDB, setSavingMapToDB] = useState(false)

  const [showSavedMapToDB_Notification, setShowSavedMapToDB_Notification] = useState(false)

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
        if (type == 'listview') downloadListviewImage('png')
        else downloadImage(type, resolution, 'png')
        dispatch({ type: SELECTED_FILE_TYPE, payload: 'PNG' })
        break;
      case 'JPG':
        if (type == 'listview') downloadListviewImage('jpg')
        else downloadImage(type, resolution, 'jpg')
        dispatch({ type: SELECTED_FILE_TYPE, payload: 'JPG' })
        break;
      default:
        downloadSVG()
    }
  }

  const downloadSVG = (type) => {
    dispatch({ type: SAVING_FILE })
    var svgData = document.getElementsByTagName('svg')[0].outerHTML
    var svgBlob = new Blob([svgData], { type:"image/svg+xml;charset=utf-8" })
    var svgUrl = URL.createObjectURL(svgBlob)
    var downloadLink = document.createElement("a")
    downloadLink.href = svgUrl
    downloadLink.download = `${type}.svg`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    dispatch({ type: FILE_SAVED })
    setTimeout(() => dispatch({ type: HIDE_FILE_SAVE_NOTIFICATION }), 2000)
  }

  const downloadImage = (type, resolution, ext) => {

    batch(() => {
      dispatch({ type: SAVING_FILE })
      if (ext == 'png') dispatch({ type: HIDE_MAP_BG })
      else dispatch({ type: DISPLAY_MAP_BG })
    })

    setTimeout(() => {
      dlSvg(document.getElementsByTagName('svg')[0], `${type}.${ext}`)
    }, 2000)

    function copyStylesInline(destinationNode, sourceNode) {
      var containerElements = ["svg","g"]
      for (var cd = 0; cd < destinationNode.childNodes.length; cd++) {
        var child = destinationNode.childNodes[cd]
        if (containerElements.indexOf(child.tagName) != -1) {
              copyStylesInline(child, sourceNode.childNodes[cd])
              continue;
        }
        var style = sourceNode.childNodes[cd].currentStyle || window.getComputedStyle(sourceNode.childNodes[cd])
        if (style == "undefined" || style == null) continue;
        for (var st = 0; st < style.length; st++){
            child.style.setProperty(style[st], style.getPropertyValue(style[st]))
        }
      }
    }

    function triggerDownload (imgURI, fileName) {
      var evt = new MouseEvent("click", {
        view: window,
        bubbles: false,
        cancelable: true
      })
      var a = document.createElement("a")
      a.setAttribute("download", fileName)
      a.setAttribute("href", imgURI)
      a.setAttribute("target", '_blank')
      a.dispatchEvent(evt)
    }

    function dlSvg(svg, fileName) {
      var copy = svg.cloneNode(true)
      copyStylesInline(copy, svg)
      var canvas = document.createElement("canvas")
      canvas.width = (innerHeight * 1.25) * resolution
      canvas.height = innerHeight * resolution
      var ctx = canvas.getContext("2d")
      ctx.scale(resolution, resolution)
      ctx.clearRect(0, 0, (innerHeight * 1.25), innerHeight)
      var data = (new XMLSerializer()).serializeToString(copy)
      var DOMURL = window.URL || window.webkitURL || window
      var img = new Image()
      var svgBlob = new Blob([data], {type: "image/svg+xml;charset=utf-8"})
      var url = DOMURL.createObjectURL(svgBlob)
      img.onload = function () {
        ctx.drawImage(img, 0, 0, (innerHeight * 1.25), innerHeight)
        DOMURL.revokeObjectURL(url)
        if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
          var blob = canvas.msToBlob()
          navigator.msSaveOrOpenBlob(blob, fileName)
        } else {
          var imgURI = canvas
              .toDataURL(`image/${ext}`)
              .replace(`image/${ext}`, "image/octet-stream")
              triggerDownload(imgURI, fileName)
        }
      }
      img.src = url
      dispatch({ type: FILE_SAVED })
      setTimeout(() => dispatch({ type: HIDE_FILE_SAVE_NOTIFICATION }), 2000)
    }

  }

  const downloadPDF = () => {
    batch(() => {
      dispatch({ type: SAVING_FILE })
      dispatch({ type: DOWNLOADING_PDF })
    })
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
                .then(() => {
                  batch(() => {
                    dispatch({ type: DOWNLOADED_PDF })
                    dispatch({ type: FILE_SAVED })
                    setTimeout(() => dispatch({ type: HIDE_FILE_SAVE_NOTIFICATION }))
                  })
                })
                .catch(err => console.log(err))
    }, 2000)
  }

  const downloadListviewImage = (ext) => {
    batch(() => {
      // if (ext == 'png') dispatch({ type: HIDE_MAP_BG })
      // else dispatch({ type: DISPLAY_MAP_BG })
      dispatch({ type: LISTVIEW_RENDERING })
      dispatch({ type: SAVING_FILE })
    })
    setTimeout(initRender, 2000)
    function initRender () {
      html2canvas(document.querySelector('#listview-content'), { letterRendering: true, allowTaint: true, useCORS: true })
          .then((canvas) => {
            saveAs(canvas.toDataURL(), `listview.${ext}`)
            setTimeout(() => {
              batch(() => {
                dispatch({ type: FILE_SAVED })
                dispatch({ type: LISTVIEW_NOT_RENDERING })
                setTimeout(() => dispatch({ type: HIDE_FILE_SAVE_NOTIFICATION }))
              })
            }, 2000)
          })
    }
    function saveAs(uri, filename) {
      var link = document.createElement('a')
      if (typeof link.download === 'string') {
        link.href = uri
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        window.open(uri)
      }
    }
  }

  const saveListingPointmap = (global = false) => {
    if (selectedDestinationsPointmap) {
      let endpoint = global == true ? '/globalmaps/' : '/mymaps/'
      let arr = Object.keys(selectedDestinationsPointmap).map(idx => {
        return [idx].concat(selectedDestinationsPointmap[idx].map(_idx => _idx.code))
      })
      setSavingMapToDB(true)
      axios.post(endpoint, { type: type, labels: JSON.stringify({ positions: pointmap_labelPositions, displayTypes: pointmap_labelDisplayTypes }), locations: JSON.stringify(arr) }, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
           .then(response => {
             setSavingMapToDB(false)
             setShowSavedMapToDB_Notification(true)
             setTimeout(() => setShowSavedMapToDB_Notification(false), 500)
           })
           .catch(err => console.log(err))
    }
  }

  const saveListing = (global = false) => {
    if (selectedOriginSpidermap || selectedOriginListView) {
      let arr = []
      let endpoint = global == true ? '/globalmaps/' : '/mymaps/'
      type == 'listview' ? arr.push(selectedOriginListView.code) : arr.push(selectedOriginSpidermap.code)
      type == 'listview' ? selectedDestinationsListView.forEach(dest => arr.push(dest.code)) : selectedDestinationsSpidermap.forEach(dest => arr.push(dest.code))
      setSavingMapToDB(true)
      axios.post(endpoint, { type: type, labels: JSON.stringify({ positions: spidermap_labelPositions, displayTypes: spidermap_labelDisplayTypes }), locations: JSON.stringify(arr) }, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
           .then(response => {
             setSavingMapToDB(false)
             setShowSavedMapToDB_Notification(true)
             setTimeout(() => setShowSavedMapToDB_Notification(false), 500)
           })
           .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    if (type == 'listview') setFileType('PNG')
    window.onafterprint = null
    window.onafterprint = () => dispatch({ type: NOT_PRINTING_LISTVIEW })
  }, [])

  return (<>
    {
      savingFile == 'SAVING_FILE'
      ? (<div className='deleting-or-saving-to-db-strip'> Saving file... </div>)
      : null
    }
    {
      savingFile == 'FILE_SAVED'
      ? (<div className='deleting-or-saving-to-db-strip'> File saved! </div>)
      : null
    }
    {
      savingMapToDB
      ?
        (<div className='deleting-or-saving-to-db-strip'> Saving map to database... </div>)
      : null
    }
    {
      showSavedMapToDB_Notification
      ?
        (<div className='deleting-or-saving-to-db-strip'> Saved! </div>)
      : null
    }
    <div
      className='col-med panel-style'
      style={{ height: '100vh', width:'200px' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}>
        <div
          style={{ margin: '50% 0 0 0', padding: '0 10% 0 15%' }}>
          <div className='map-type-title'>
            Export<br/>
            {props.label}
          </div>
          <div
            className='my-map-option'
            onClick={() => {
              dispatch({ type: LAST_LOCATION, payload: `generate-${type}` })
              props.history.push(`/${type}`)
            }}>
            Edit This Map
          </div>
          <div
            className='my-map-option'
            onClick={() => {
              dispatch({ type: LAST_LOCATION, payload: `generate-${type}` })
              props.history.push(`/my-maps`)
            }}>
            To My Saved Maps
          </div>
          <div
            className='my-map-option'
            onClick={() => {
              dispatch({ type: LAST_LOCATION, payload: `generate-${type}` })
              props.history.push(`/global-maps`)
            }}>
            To Global Maps
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
              <option value='JPG'>JPG</option>
              <option value='PDF'>PDF</option>
            </select>
            {
              fileType == 'PNG' || fileType == 'JPG'
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
              className='download-button button-generic'
              style={{ backgroundColor: 'red' }}
              onClick={handleDownload}>
              Download {fileType}
            </button>
            <br/>
            <button
              className='button-generic'
              style={{ backgroundColor: '#006CC4' }}
              onClick={type == 'listview' || type == 'spidermap' ? saveListing : saveListingPointmap}>
              <span>Save Map</span>
              <img
                style={{ margin: '0 0 0 10px', width: '20px' }}
                src='./img/save.svg'/>
            </button>
            <br/>
            {
              getUser().user.isadmin == true
              ?
              (<button
                className='button-generic'
                onClick={
                  type == 'listview' || type == 'spidermap'
                  ? () => saveListing(true) : () => saveListingPointmap(true)
                }
                style={{ backgroundColor: '#004b84' }}>
                <span>Save Global</span>
                <img
                  style={{ margin: '0 0 0 10px', width: '20px' }}
                  src='./img/save.svg'/>
              </button>)
              : null
            }
          </div>
        </div>
      </div>
      <br/>
    </div>
  </>)

}

export default withRouter(DownloadImagePanel)
