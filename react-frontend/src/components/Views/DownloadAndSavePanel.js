import React, { useState, useEffect, useRef } from 'react'
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
import DropdownGraphicStyle from '../Dropdowns/DropdownGraphicStyle'
import '../../images/save.svg'
import '../Pages/my-maps.scss'
import axios from 'axios'

const DownloadImagePanel = ({ ...props }) => {

  const { history, type } = props

  const dispatch = useDispatch()

  const [fileType, setFileType] = useState('SVG')

  const [resolution, setResolution] = useState(2)

  const windowSize = useSelector(state => state.windowSize)

  const selectedOriginListView = useSelector(state => state.selectedOriginListView)

  const selectedDestinationsListView = useSelector(state => state.selectedDestinationsListView)

  const selectedOriginSpidermap = useSelector(state => state.selectedOriginSpidermap)

  const selectedDestinationsSpidermap = useSelector(state => state.selectedDestinationsSpidermap)

  const selectedOriginsPointmap = useSelector(state => state.selectedOriginsPointmap)

  const selectedDestinationsPointmap = useSelector(state => state.selectedDestinationsPointmap)

  const savingFile = useSelector(state => state.savingFile)

  const listviewRendering = useSelector(state => state.listviewRendering)

  const pointmap_labelPositions = useSelector(state => state.pointmap_labelPositions)

  const pointmap_labelDisplayTypes = useSelector(state => state.pointmap_labelDisplayTypes)

  const spidermap_labelPositions = useSelector(state => state.spidermap_labelPositions)

  const spidermap_labelDisplayTypes = useSelector(state => state.spidermap_labelDisplayTypes)

  const [savingMapToDB, setSavingMapToDB] = useState(false)

  const [showSavedMapToDB_Notification, setShowSavedMapToDB_Notification] = useState(false)

  const [buttonsContainerBottom, setButtonsContainerBottom] = useState(0)

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
      pagebreak: { mode: 'avoid-all' },
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
    setTimeout(initRender, 3000)
    function initRender () {
      html2canvas(document.querySelector('#listview-content'), { letterRendering: true, allowTaint: true, useCORS: true, backgroundColor: ext == 'png' ? "rgba(0,0,0,0)" : '#fff' })
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
      axios.post(endpoint, { belongsto: getUser().user._id, type: type, labels: JSON.stringify({ positions: pointmap_labelPositions, displayTypes: pointmap_labelDisplayTypes }), locations: JSON.stringify(arr) }, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
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
      axios.post(endpoint, { belongsto: getUser().user._id, type: type, labels: JSON.stringify({ positions: spidermap_labelPositions, displayTypes: spidermap_labelDisplayTypes }), locations: JSON.stringify(arr) }, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
           .then(response => {
             setSavingMapToDB(false)
             setShowSavedMapToDB_Notification(true)
             setTimeout(() => setShowSavedMapToDB_Notification(false), 500)
           })
           .catch(err => console.log(err))
    }
  }

  const downloadSaveButtonsContainerRef = useRef()

  const getButtonsContainerBottom = () => (
    downloadSaveButtonsContainerRef && downloadSaveButtonsContainerRef.current
    ? (parseInt(getComputedStyle(downloadSaveButtonsContainerRef.current, null).getPropertyValue('height')) * (fileType && (fileType == 'PNG' || fileType == 'JPG') ? .575 : .75)) + 'px'
    : 0
  )

  useEffect(() => {
    if (type == 'listview') {
      setFileType('PNG')
      dispatch({ type: SELECTED_FILE_TYPE, payload: 'PNG' })
    } else {
      setFileType('SVG')
      dispatch({ type: SELECTED_FILE_TYPE, payload: 'SVG' })
    }
    window.onafterprint = null
    window.onafterprint = () => dispatch({ type: NOT_PRINTING_LISTVIEW })
    setButtonsContainerBottom(getButtonsContainerBottom())
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
      style={{ height: '100vh', width:'300px' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          zIndex: 20,
          position: windowSize && windowSize.innerHeight > 600 ? 'relative' : '',
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
            <>Edit This {type != 'listview' ? 'Map' : 'List' }</>
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
            ref={downloadSaveButtonsContainerRef}
            style={{
              margin: 'auto',
              position: 'absolute',
              backgroundColor: '#fff',
              border: windowSize && windowSize.innerHeight > 600 ? 'none' : '1px solid #ccc',
              padding: windowSize && windowSize.innerHeight > 600 ? 0 : '20px',
              left: windowSize && windowSize.innerHeight > 600 ? 0 : 'auto',
              right: 0,
              // right: windowSize && windowSize.innerHeight > 600 ? 0 : -windowSize.innerWidth,
              width: '150px',
              bottom: windowSize && windowSize.innerHeight > 600 ? buttonsContainerBottom : 0,
            }}>
            <div>Select file type:</div>
            <DropdownGraphicStyle overrideStyle={{}}>{fileType}</DropdownGraphicStyle>
            <select
              style={{ opacity: '0.001' }}
              onClick={() => setButtonsContainerBottom(getButtonsContainerBottom())}
              onChange={e => {
                setFileType(e.target.value)
                setButtonsContainerBottom(getButtonsContainerBottom())
              }}>
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
                  <DropdownGraphicStyle overrideStyle={{}}>{resolution}</DropdownGraphicStyle>
                  <select
                    style={{ opacity: '0.001' }}
                    defaultValue='2'
                    onClick={() => setButtonsContainerBottom(getButtonsContainerBottom())}
                    onChange={e => {
                      setResolution(e.target.value)
                      setButtonsContainerBottom(getButtonsContainerBottom())
                    }}>
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
