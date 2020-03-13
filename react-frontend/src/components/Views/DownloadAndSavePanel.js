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
  LAST_LOCATION,
  SAVING_FILE,
  FILE_SAVED,
  HIDE_FILE_SAVE_NOTIFICATION,
  DISPLAY_MAP_BG,
  HIDE_MAP_BG,
  EXPORT_RESOLUTION,
  SELECTED_FILE_TYPE,
  SET_MAP_NAME
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

  const [resolutionPixels, setResolutionPixels] = useState()

  // const [mapName, setMapName] = useState('Not labeled')
  const mapName = useSelector(state => state.editingMapName)

  const exportFileType = useSelector(state => state.exportFileType)

  const exportResolution = useSelector(state => state.exportResolution)

  const windowSize = useSelector(state => state.windowSize)

  const selectedOriginListView = useSelector(state => state.selectedOriginListView)

  const selectedDestinationsListView = useSelector(state => state.selectedDestinationsListView)

  const selectedOriginSpidermap = useSelector(state => state.selectedOriginSpidermap)

  const selectedDestinationsSpidermap = useSelector(state => state.selectedDestinationsSpidermap)

  const selectedOriginsPointmap = useSelector(state => state.selectedOriginsPointmap)

  const selectedDestinationsPointmap = useSelector(state => state.selectedDestinationsPointmap)

  const savingFile = useSelector(state => state.savingFile)

  const listviewRendering = useSelector(state => state.listviewRendering)

  const listview_currentlyEditing = useSelector(state => state.listview_currentlyEditing)

  const pointmap_labelPositions = useSelector(state => state.pointmap_labelPositions)

  const pointmap_labelDisplayTypes = useSelector(state => state.pointmap_labelDisplayTypes)

  const pointmap_currentlyEditing = useSelector(state => state.pointmap_currentlyEditing)

  const spidermap_labelPositions = useSelector(state => state.spidermap_labelPositions)

  const spidermap_labelDisplayTypes = useSelector(state => state.spidermap_labelDisplayTypes)

  const spidermap_renderType = useSelector(state => state.spidermap_renderType)

  const spidermap_distLimit = useSelector(state => state.spidermap_distLimit)

  const spidermap_angleAdjustment = useSelector(state => state.spidermap_angleAdjustment)

  const spidermap_currentlyEditing = useSelector(state => state.spidermap_currentlyEditing)

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

  const alphaSort = (a,b) => {
    if (a < b) return -1
    if (a > b) return 1
    return 0
  }

  const savePointmap = (global = false) => {
    const postNewPointmap = (endpoint, arr) => {
      axios
        .post(endpoint,
          {
            belongsto: getUser().user._id,
            type: type,
            name: mapName,
            labels: JSON.stringify({ positions: pointmap_labelPositions, displayTypes: pointmap_labelDisplayTypes }),
            locations: JSON.stringify(arr)
          },
          {
            headers: { 'Authorization': `Bearer ${getUser().jwt}` }
          })
          .then(response => {
            setSavingMapToDB(false)
            setShowSavedMapToDB_Notification(true)
            setTimeout(() => setShowSavedMapToDB_Notification(false), 500)
          })
          .catch(err => console.log(err))
    }
    if (selectedDestinationsPointmap) {
      let endpoint = global == true ? '/globalmaps/' : '/mymaps/'
      let arr = Object.keys(selectedDestinationsPointmap).map(idx => {
        return [idx].concat(selectedDestinationsPointmap[idx].map(_idx => _idx.code))
      })
      setSavingMapToDB(true)
      if (pointmap_currentlyEditing) {
        dispatch({ type: SET_MAP_NAME, payload: mapName })
        axios
        .put(endpoint + pointmap_currentlyEditing.id,
          {
            belongsto: getUser().user._id,
            type: type,
            name: mapName,
            labels: JSON.stringify({ positions: pointmap_labelPositions, displayTypes: pointmap_labelDisplayTypes }),
            locations: JSON.stringify(arr)
          },
          {
            headers: { 'Authorization': `Bearer ${getUser().jwt}` }
          })
          .then(response => {
            setSavingMapToDB(false)
            setShowSavedMapToDB_Notification(true)
            setTimeout(() => setShowSavedMapToDB_Notification(false), 500)
          })
          .catch(err => {
            postNewPointmap(endpoint, arr)
          })
      }
    }
  }

  const saveListview = (global = false) => {
    const postNewListview = (endpoint, arr) => {
      axios.post(endpoint, {
          belongsto: getUser().user._id,
          type: type,
          name: mapName,
          labels: null,
          locations: JSON.stringify(arr),
          distlimit: null,
          angleadjust: null,
          rendertype: null
        },
          { headers: { 'Authorization': `Bearer ${getUser().jwt}` }
        })
           .then(response => {
             setSavingMapToDB(false)
             setShowSavedMapToDB_Notification(true)
             setTimeout(() => setShowSavedMapToDB_Notification(false), 500)
           })
           .catch(err => console.log(err))
    }
    if (selectedOriginListView) {
      let arr = []
      let endpoint = global == true ? '/globalmaps/' : '/mymaps/'
      arr.push(selectedOriginListView.code)
      selectedDestinationsListView.forEach(dest => arr.push(dest.code))
      setSavingMapToDB(true)
      if (listview_currentlyEditing) {
        dispatch({ type: SET_MAP_NAME, payload: mapName })
        axios.put(endpoint + listview_currentlyEditing.id,
          {
            belongsto: getUser().user._id,
            type: type,
            name: mapName,
            labels: null,
            locations: JSON.stringify(arr),
            distlimit: null,
            angleadjust: null,
            rendertype: null
          },
          { headers: { 'Authorization': `Bearer ${getUser().jwt}` }
        })
        .then(response => {
          setSavingMapToDB(false)
          setShowSavedMapToDB_Notification(true)
          setTimeout(() => setShowSavedMapToDB_Notification(false), 500)
        })
        .catch(err => {
          // if error updating, try to post a new entry
          console.log(err)
          postNewListview(endpoint, arr)
        })
      } else {
        postNewListview(endpoint, arr)
      }
    }
  }

  const saveSpidermap = (global = false) => {
    const postNewMap = (endpoint, arr) => {
      axios.post(endpoint, {
          belongsto: getUser().user._id,
          type: type,
          name: mapName,
          labels: JSON.stringify({ positions: spidermap_labelPositions, displayTypes: spidermap_labelDisplayTypes }),
          locations: JSON.stringify(arr),
          distlimit: spidermap_distLimit,
          angleadjust: spidermap_angleAdjustment,
          rendertype: spidermap_renderType
        },
          { headers: { 'Authorization': `Bearer ${getUser().jwt}` }
        })
           .then(response => {
             setSavingMapToDB(false)
             setShowSavedMapToDB_Notification(true)
             setTimeout(() => setShowSavedMapToDB_Notification(false), 500)
           })
           .catch(err => console.log(err))
    }
    if (selectedOriginSpidermap) {
      let arr = []
      let endpoint = global == true ? '/globalmaps/' : '/mymaps/'
      arr.push(selectedOriginSpidermap.code)
      selectedDestinationsSpidermap.forEach(dest => arr.push(dest.code))
      // arr.sort(alphaSort)
      setSavingMapToDB(true)
      if (spidermap_currentlyEditing) {
        dispatch({ type: SET_MAP_NAME, payload: mapName })
        axios.put(endpoint + spidermap_currentlyEditing.id,
          {
            belongsto: getUser().user._id,
            type: type,
            name: mapName,
            labels: JSON.stringify({ positions: spidermap_labelPositions, displayTypes: spidermap_labelDisplayTypes }),
            locations: JSON.stringify(arr),
            distlimit: spidermap_distLimit,
            angleadjust: spidermap_angleAdjustment,
            rendertype: spidermap_renderType
          },
          { headers: { 'Authorization': `Bearer ${getUser().jwt}` }
        })
        .then(response => {
          setSavingMapToDB(false)
          setShowSavedMapToDB_Notification(true)
          setTimeout(() => setShowSavedMapToDB_Notification(false), 500)
        })
        .catch(err => {
          // if error updating, try to post a new entry
          console.log(err)
          postNewMap(endpoint, arr)
        })
      } else {
        postNewMap(endpoint, arr)
      }
    }
  }

  const downloadSaveButtonsContainerRef = useRef()

  const getButtonsContainerBottom = () => (
    downloadSaveButtonsContainerRef && downloadSaveButtonsContainerRef.current
    ? (parseInt(getComputedStyle(downloadSaveButtonsContainerRef.current, null).getPropertyValue('height')) * (fileType && type != 'listview' && (fileType == 'PNG' || fileType == 'JPG') ? .75 : .95)) + 'px'
    : 0
  )

  const getCSV = (csv, fileTitle) => {
    var exportedFilename = fileTitle + '.csv' || 'export.csv';
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
  }

  const downloadCSV = () => {
    let csv = [], fileTitle
    type == 'listview' ? csv.push(selectedOriginListView.code) : csv.push(selectedOriginSpidermap.code)
    type == 'listview' ? selectedDestinationsListView.forEach(dest => csv.push(dest.code)) : selectedDestinationsSpidermap.forEach(dest => csv.push(dest.code))
    type == 'listview' ? fileTitle = 'listview' : fileTitle = 'spidermap'
    getCSV('origin, destinations...\n' + csv, fileTitle)
  }

  const downloadCSVPointmap = () => {
    let csv = Object.keys(selectedDestinationsPointmap).map(idx => {
      return [idx].concat(selectedDestinationsPointmap[idx].map(_idx => _idx.code))
    })
    let string = ''
    csv.forEach(list => string += '\n'+list.join(','))
    getCSV('origins, destinations...\n'+string, 'pointmap')
  }

  useEffect(() => {
    if (type == 'listview') {
      setFileType('PNG')
      dispatch({ type: SELECTED_FILE_TYPE, payload: 'PNG' })
      // dispatch({ type: EXPORT_RESOLUTION, payload: 2 })
    } else {
      setFileType('SVG')
      dispatch({ type: SELECTED_FILE_TYPE, payload: 'SVG' })
      // dispatch({ type: EXPORT_RESOLUTION, payload: 2 })
    }
    window.onafterprint = null
    window.onafterprint = () => dispatch({ type: NOT_PRINTING_LISTVIEW })
    setButtonsContainerBottom(getButtonsContainerBottom())
  }, [])

  useEffect(() => {
    let global = getUser().user.isadmin == true ? true : false
    let endpoint = global == true ? '/globalmaps/' : '/mymaps/'

    if (spidermap_currentlyEditing && type == 'spidermap') {
      // dispatch({ type: SET_MAP_NAME, payload: spidermap_currentlyEditing.name })
      axios.get(endpoint, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
        .then(data => {
          let map = data.data.find(datum => (
            datum._id == spidermap_currentlyEditing.id
          ))
          dispatch({ type: SET_MAP_NAME, payload: map.name ? map.name : '' })
        })
        .catch(err => console.log(err))
    } else
    if (pointmap_currentlyEditing && type == 'pointmap') {
      // dispatch({ type: SET_MAP_NAME, payload: pointmap_currentlyEditing.name })
      axios.get(endpoint, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
        .then(data => {
          let map = data.data.find(datum => (
            datum._id == pointmap_currentlyEditing.id
          ))
          dispatch({ type: SET_MAP_NAME, payload: map.name ? map.name : '' })
        })
        .catch(err => console.log(err))
    } else
    if (listview_currentlyEditing && type == 'listview') {
      axios.get(endpoint, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
        .then(data => {
          let map = data.data.find(datum => (
            datum._id == listview_currentlyEditing.id
          ))
          dispatch({ type: SET_MAP_NAME, payload: map.name ? map.name : '' })
        })
        .catch(err => console.log(err))
    } else {
      dispatch({ type: SET_MAP_NAME, payload: '' })
    }
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
          style={{
            margin: type == 'listview' || type == 'spidermap' ? '70% 0 0 0' : '54% 0 0 0',
            padding: '0 10% 0 15%'
          }}>
          <div
            className='map-type-title'
            style={{
              padding: '0 0 17.5% 0'
            }}>
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
          <div
            className='my-map-option'
            onClick={type == 'listview' || type == 'spidermap' ? downloadCSV : downloadCSVPointmap}>
            Download CSV
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
              onClick={() => {
                setButtonsContainerBottom(getButtonsContainerBottom())
                if (document.getElementById('map-content')) {
                  setResolutionPixels(parseInt(getComputedStyle(document.getElementById('map-content')).getPropertyValue('width')))
                }
              }}
              onChange={e => {
                setFileType(e.target.value)
                dispatch({ type: SELECTED_FILE_TYPE, payload: e.target.value })
                setButtonsContainerBottom(getButtonsContainerBottom())
              }}>
              { type != 'listview' ? <option value='SVG'>SVG</option> : null }
              <option value='PNG'>PNG</option>
              <option value='JPG'>JPG</option>
              { type == 'listview' ? <option value='PDF'>PDF</option> : null }
            </select>
            {
              (fileType == 'PNG' || fileType == 'JPG') && type != 'listview'
              ?
                (<>
                  <div>Select resolution:</div>
                  <DropdownGraphicStyle overrideStyle={{}}>{resolution}x - {resolutionPixels*resolution}px</DropdownGraphicStyle>
                  <select
                    style={{ opacity: '0.001' }}
                    defaultValue={resolution}
                    onClick={() => {
                      setButtonsContainerBottom(getButtonsContainerBottom())
                      if (document.getElementById('map-content')) {
                        setResolutionPixels(parseInt(getComputedStyle(document.getElementById('map-content')).getPropertyValue('width')))
                      }
                    }}
                    onChange={e => {
                      setResolution(e.target.value)
                      // dispatch({ type: EXPORT_RESOLUTION, payload: e.target.value })
                      setButtonsContainerBottom(getButtonsContainerBottom())
                    }}>
                    <option value='1'>1x &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                    <option value='2'>2x &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                    <option value='3'>3x &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
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
            <br/>
            <input
              placeholder='enter a map label'
              type='text'
              value={mapName}
              onChange={ e => dispatch({ type: SET_MAP_NAME, payload: e.target.value }) }
              />
            <br/>
            <br/>
            <button
              className='button-generic'
              style={{ backgroundColor: '#006CC4' }}
              onClick={
                type == 'listview'
                ? () => saveListview()
                :
                  type == 'spidermap'
                  ? () => saveSpidermap()
                  : () => savePointmap()
              }
              >
              <span>Save Map</span>
            </button>
            <br/>
            {
              getUser().user.isadmin == true
              ?
              (<button
                className='button-generic'
                style={{ backgroundColor: '#004b84' }}
                onClick={
                  type == 'listview'
                  ? () => saveListview(true)
                  :
                    type == 'spidermap'
                    ? () => saveSpidermap(true)
                    : () => savePointmap(true)
                }
                >
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
