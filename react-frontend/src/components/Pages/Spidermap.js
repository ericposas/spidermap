import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getUser } from '../../sessionStore'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import DropdownGraphicStyle from '../Dropdowns/DropdownGraphicStyle'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import SelectBy_Destinations_Spidermap from '../Views/SelectBy_Destinations_Spidermap'
import UploadModal from '../Modals/UploadModal'
import { checkAuth } from '../../sessionStore'
import { LAST_LOCATION } from '../../constants/constants'
import {
  CLEAR_ORIGIN_SPIDERMAP,
  SET_ORIGIN_SPIDERMAP,
  REMOVE_ALL_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP,
} from '../../constants/spidermap'
import { SET_TIMEZONE_LATLONGS } from '../../constants/constants'
import { CSSTransition } from 'react-transition-group'
import axios from 'axios'

const Spidermap = ({ ...props }) => {

  const dispatch = useDispatch()

  const lastLocation = useSelector(state => state.lastLocation)

  const selectedOriginSpidermap = useSelector(state => state.selectedOriginSpidermap)

  const selectedDestinationsSpidermap = useSelector(state => state.selectedDestinationsSpidermap)

  const spidermap_selectBy_DestinationsVisibility = useSelector(state => state.spidermap_selectBy_DestinationsVisibility)

  const spidermap_selectByCodeDestinations = useSelector(state => state.spidermap_selectByCodeDestinations)

  const spidermap_selectByCategoryDestinations = useSelector(state => state.spidermap_selectByCategoryDestinations)

  const uploadingCSVNotification = useSelector(state => state.uploadingCSVNotification)

  const uploadCSVDoneNotification = useSelector(state => state.uploadCSVDoneNotification)

  const timezoneLatLongs = useSelector(state => state.timezoneLatLongs)

  const [showUploadCSVModal, setShowUploadCSVModal] = useState(false)

  const setModalVisibility = value => setShowUploadCSVModal(value)

  const uploadButtonRef = useRef()

  const buttonContainerRef = useRef()

  const [buttonContainerBottom, setButtonContainerBottom] = useState(0)

  const computeButtonContainerBottom = () => {
    return getComputedStyle(uploadButtonRef.current, null).getPropertyValue('height')
  }

  const handleGenerateMapClick = () => {
    if (selectedDestinationsSpidermap.length > 0) {
      dispatch({ type: LAST_LOCATION, payload: 'spidermap' })
      dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP })
      props.history.push('/generate-spidermap')
    }
  }

  const clearList = () => {
    batch(() => {
      dispatch({ type: SET_ORIGIN_SPIDERMAP, payload: null })
      dispatch({ type: CLEAR_ORIGIN_SPIDERMAP })
      dispatch({ type: REMOVE_ALL_DESTINATIONS_SPIDERMAP })
    })
  }

  useEffect(() => {
    if (!checkAuth()) setTimeout(() => props.history.push('/'))
    else {
      setButtonContainerBottom(computeButtonContainerBottom())
      // load timezone data
      if (!timezoneLatLongs) {
        axios.get('/timezones', { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
             .then(result => {
               console.log(result.data[0].all)
               dispatch({ type: SET_TIMEZONE_LATLONGS, payload: result.data[0].all })
             })
      }
    }
  }, [])

  return (
    <>
      {
        uploadingCSVNotification
        ? (<div className='deleting-or-saving-to-db-strip'> Uploading and processing CSV entries.. </div>)
        : null
      }
      {
        uploadCSVDoneNotification
        ? (<div className='deleting-or-saving-to-db-strip'> CSV data processed! </div>)
        : null
      }
      <div className='row' style={{whiteSpace:'nowrap'}}>
        <UserLeftSidePanel/>
        <div key={'spidermap-panel'} className='col-med panel-style'
             style={{
               height:'100vh', minWidth:'300px',
             }}>
          <div style={{
                width: '100%', height: '100%',
                position: 'relative',
            }}>
            <div style={{ margin: '10% 0 0 10%' }}>
              <div className='map-type-title'>
                Spidermap
              </div>
            </div>
            <br/>
            <span style={{ position: 'absolute', left: '10%', margin: 'auto', width: '100px', marginTop: '5%' }}>
              <DropdownGraphicStyle overrideStyle={{ fontSize: '1.5rem' }}>
                {
                  !selectedOriginSpidermap
                  ? <>Origin Airport</>
                : selectedOriginSpidermap.city
                }
              </DropdownGraphicStyle>
            </span>
            <span style={{ opacity: '0.001' }}>
              <Dropdown type='code' output='spidermap-origin'/>
            </span>
            <div ref={buttonContainerRef}
                 className='button-container'
                 style={{
                   bottom: buttonContainerBottom,
                   width: '60%', margin: 'auto',
                   left: 0, right: 0, position: 'absolute',
                }}>
              <button
                className='button-generic'
                onClick={() => setShowUploadCSVModal(true)}
                style={{ backgroundColor: '#37ACF4' }}>
                Upload CSV
              </button>
              <br/>
              <button
                className='button-generic'
                ref={uploadButtonRef}
                onClick={handleGenerateMapClick}
                style={{
                  border: selectedOriginSpidermap && selectedDestinationsSpidermap.length > 0 ? 'none' : '1px solid #ccc',
                  pointerEvents: selectedOriginSpidermap && selectedDestinationsSpidermap.length > 0 ? 'all' : 'none',
                  color: selectedOriginSpidermap && selectedDestinationsSpidermap.length > 0 ? 'white' : '#ccc',
                  backgroundColor: selectedOriginSpidermap && selectedDestinationsSpidermap.length > 0 ? 'red' : '#fff'
                }}>
                Generate Spidermap
              </button>
              <br/>
              {
                selectedOriginSpidermap && selectedDestinationsSpidermap.length > 0
                ?
                  (<button
                    className='button-generic'
                    onClick={clearList}
                    style={{ margin: '0 0 10px 0', backgroundColor: '#006CC4' }}>
                    Clear List
                  </button>)
                : null
              }
            </div>
          </div>
        </div>
        <CSSTransition
          in={selectedOriginSpidermap != null}
          timeout={300}
          classNames='slide'>
          <div className='col-med'>
            { selectedOriginSpidermap ? <SelectionView type='spidermap-destinations'/> : null }
          </div>
        </CSSTransition>
        {
          selectedOriginSpidermap && spidermap_selectByCodeDestinations
          ?
          <CSSTransition
            in={spidermap_selectBy_DestinationsVisibility}
            timeout={300}
            classNames='slide'
            >
             <div
               key={'spidermap-panel-2'}
               className='col-med panel-style'
               style={{
                 minWidth: '200px', padding: '20px 20px 0 20px',
               }}>
               <Dropdown type='code' output='spidermap-destinations'/>
             </div>
          </CSSTransition> : null
        }
        {
          selectedOriginSpidermap && spidermap_selectByCategoryDestinations
          ?
          <CSSTransition
            in={spidermap_selectByCategoryDestinations}
            timeout={300}
            classNames='slide'
            >
             <div
               className='col-med panel-style'
               style={{
                 minWidth: '200px', padding: '20px 20px 0 20px',
               }}>
               <Dropdown type='category' output='spidermap-destinations'/>
             </div>
          </CSSTransition> : null
        }
      </div>
      {
        showUploadCSVModal ? <UploadModal type='spidermap' setModalVisibility={setShowUploadCSVModal} /> : null
      }
    </>
  )

}

export default withRouter(Spidermap)
