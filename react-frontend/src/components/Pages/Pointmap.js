import React, { useState, useEffect, useRef, Fragment } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import BackButton from '../Buttons/BackButton'
import UploadForm from '../Forms/UploadForm'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import SelectBy_Origins from '../Views/SelectBy_Origins'
import SelectBy_Destinations_Pointmap from '../Views/SelectBy_Destinations_Pointmap'
import UploadModal from '../Modals/UploadModal'
import { checkAuth } from '../../sessionStore'
import { LAST_LOCATION } from '../../constants/constants'
import {
  SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP,
  HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP,
  HIDE_DESTINATION_PANEL_POINTMAP,
  CLEAR_ORIGIN_LOCATIONS_POINTMAP,
  SET_DESTINATION_LOCATIONS_POINTMAP_AT_ONCE,
  SET_ALL_LABEL_POSITIONS_POINTMAP,
  SET_ALL_LABEL_DISPLAY_TYPES_POINTMAP
} from '../../constants/pointmap'
import { CSSTransition } from 'react-transition-group'

const Pointmap = ({ ...props }) => {

  const dispatch = useDispatch()

  const currentlySelectedOriginPointmap = useSelector(state => state.currentlySelectedOriginPointmap)

  const pointmap_destinationPanelVisibility = useSelector(state => state.pointmap_destinationPanelVisibility)

  const pointmap_selectBy_OriginsVisibility = useSelector(state => state.pointmap_selectBy_OriginsVisibility)

  const pointmap_selectBy_DestinationsVisibility = useSelector(state => state.pointmap_selectBy_DestinationsVisibility)

  const pointmap_selectByCodeOrigins = useSelector(state => state.pointmap_selectByCodeOrigins)

  const pointmap_selectByCategoryOrigins = useSelector(state => state.pointmap_selectByCategoryOrigins)

  const pointmap_selectByCodeDestinations = useSelector(state => state.pointmap_selectByCodeDestinations)

  const pointmap_selectByCategoryDestinations = useSelector(state => state.pointmap_selectByCategoryDestinations)

  const selectedOriginsPointmap = useSelector(state => state.selectedOriginsPointmap)

  const selectedDestinationsPointmap = useSelector(state => state.selectedDestinationsPointmap)

  const lastLocation = useSelector(state => state.lastLocation)

  const uploadingCSVNotification = useSelector(state => state.uploadingCSVNotification)

  const uploadCSVDoneNotification = useSelector(state => state.uploadCSVDoneNotification)

  const [showUploadCSVModal, setShowUploadCSVModal] = useState(false)

  const setModalVisibility = value => setShowUploadCSVModal(value)

  const uploadButtonRef = useRef()

  const buttonContainerRef = useRef()

  const [buttonContainerBottom, setButtonContainerBottom] = useState(0)

  const computeButtonContainerBottom = () => getComputedStyle(uploadButtonRef.current, null).getPropertyValue('height')

  const handleGenerateMapClick = () => {
    if (Object.keys(selectedDestinationsPointmap).length > 0) {
      // dispatch({ type: LAST_LOCATION, payload: 'pointmap' })
      props.history.push('/generate-pointmap')
    }
  }

  const clearList = () => {
    batch(() => {
      dispatch({ type: SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP, payload: null })
      dispatch({ type: CLEAR_ORIGIN_LOCATIONS_POINTMAP })
      dispatch({ type: SET_DESTINATION_LOCATIONS_POINTMAP_AT_ONCE, payload: {} })
      dispatch({ type: HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP })
      dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP })
      dispatch({ type: HIDE_DESTINATION_PANEL_POINTMAP })
      dispatch({ type: SET_ALL_LABEL_POSITIONS_POINTMAP, payload: {} })
      dispatch({ type: SET_ALL_LABEL_DISPLAY_TYPES_POINTMAP, payload: {} })
    })
  }

  useEffect(() => {
    if (!checkAuth()) {
      setTimeout(() => props.history.push('/'))
    } else {
      // console.log('user is logged in')
      // dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
      setButtonContainerBottom(computeButtonContainerBottom())
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
          <div
            className='col-med panel-style'
            style={{ minWidth:'300px', height:'100vh' }}>
            <div
              style={{
                width: '100%', height: '100%',
                position: 'relative',
              }}>
              <div
                style={{ margin: '10% 0 0 10%' }}>
                <div className='map-type-title'>
                  Point-to-Point Map
                </div>
              </div>
              <br/>
              <SelectionView type='pointmap-origins'/>
              <div
                ref={buttonContainerRef}
                className='button-container'
                style={{
                  bottom: buttonContainerBottom,
                  width: '60%', margin: 'auto',
                  left: 0, right: 0, position: 'absolute',
                }}>
                <button
                  className='button-generic'
                  onClick={() => setShowUploadCSVModal(true) }
                  style={{ backgroundColor: '#37ACF4' }}>
                  Upload CSV
                </button>
                <br/>
                <button
                  className='button-generic'
                  ref={uploadButtonRef}
                  onClick={handleGenerateMapClick}
                  style={{
                    border: selectedOriginsPointmap && Object.keys(selectedDestinationsPointmap).length > 0 ? 'none' : '1px solid #e8e8e8',
                    pointerEvents: selectedOriginsPointmap && Object.keys(selectedDestinationsPointmap).length > 0 ? 'all' : 'none',
                    color: selectedOriginsPointmap && Object.keys(selectedDestinationsPointmap).length > 0 ? 'white' : '#fff',
                    backgroundColor: selectedOriginsPointmap && Object.keys(selectedDestinationsPointmap).length > 0 ? 'red' : '#e8e8e8'
                  }}>
                  Generate Pointmap
                </button>
                <br/>
                {
                  selectedOriginsPointmap && selectedOriginsPointmap.length > 0
                  ?
                    (<button
                      className='clear-list-button'
                      onClick={clearList}
                      style={{ margin: '0 0 10px 0'}}>
                      Clear List
                    </button>)
                  : null
                }
              </div>
            </div>
          </div>
        {
          selectedOriginsPointmap && Object.keys(selectedOriginsPointmap).length > 0
          ?
          <CSSTransition
            in={pointmap_destinationPanelVisibility}
            unmountOnExit
            classNames='slide'
            timeout={300}>
            <div className='col-med'>
              <SelectionView type='pointmap-destinations'/>
            </div>
          </CSSTransition> : null
        }
        {
          pointmap_selectByCodeOrigins
          ?
            <CSSTransition
              in={pointmap_selectBy_OriginsVisibility}
              unmountOnExit
              classNames='slide'
              timeout={300}>
              <div className='col-med panel-style'
                style={{
                  minWidth:'300px', height:'100vh',
                  padding: '20px 20px 0 20px',
                }}>
                <Dropdown type='code' output='pointmap-origins'/>
              </div>
            </CSSTransition> : null
        }
        {
          pointmap_selectByCategoryOrigins
          ?
          <CSSTransition
            in={pointmap_selectByCategoryOrigins}
            unmountOnExit
            classNames='slide'
            timeout={300}>
            <div className='col-med panel-style' style={{
                minWidth:'300px', height:'100vh',
                padding: '20px 20px 0 20px',
              }}>
              <Dropdown type='category' output='pointmap-origins'/>
            </div>
          </CSSTransition> : null
        }
        {
          pointmap_selectByCodeDestinations && selectedOriginsPointmap && Object.keys(selectedOriginsPointmap).length > 0
          ?
          <CSSTransition
            in={pointmap_selectBy_DestinationsVisibility}
            unmountOnExit
            classNames='slide'
            timeout={300}>
             <div
               className='col-med panel-style'
               style={{
                 minWidth:'300px', height:'100vh',
                 padding: '20px 20px 0 20px',
               }}>
               <Dropdown type='code' output='pointmap-destinations'/>
             </div>
           </CSSTransition> : null
         }
         {
           pointmap_selectByCategoryDestinations && selectedOriginsPointmap && Object.keys(selectedOriginsPointmap).length > 0
           ?
           <CSSTransition
             in={pointmap_selectByCategoryDestinations}
             unmountOnExit
             classNames='slide'
             timeout={300}>
             <div
               className='col-med panel-style'
               style={{
                 minWidth:'300px', height:'100vh',
                 padding: '20px 20px 0 20px',
               }}>
               <Dropdown type='category' output='pointmap-destinations'/>
             </div>
           </CSSTransition> : null
         }
      </div>
      <CSSTransition
        in={showUploadCSVModal}
        unmountOnExit
        timeout={300}
        classNames='alert'>
        <UploadModal type='pointmap' setModalVisibility={setShowUploadCSVModal} />
      </CSSTransition>
    </>
  )

}

export default withRouter(Pointmap)
