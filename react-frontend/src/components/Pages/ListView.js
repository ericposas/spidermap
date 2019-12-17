import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import DropdownGraphicStyle from '../Dropdowns/DropdownGraphicStyle'
import BackButton from '../Buttons/BackButton'
import UploadModal from '../Modals/UploadModal'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import { checkAuth, getUser } from '../../sessionStore'
import { LAST_LOCATION } from '../../constants/constants'
import {
  REMOVE_ORIGIN_LISTVIEW,
  REMOVE_ALL_DESTINATIONS_LISTVIEW,
} from '../../constants/listview'
import axios from 'axios'
import { CSSTransition } from 'react-transition-group'

const ListView = ({ ...props }) => {

  const dispatch = useDispatch()

  const lastLocation = useSelector(state => state.lastLocation)

  const selectedOriginListView = useSelector(state => state.selectedOriginListView)

  const selectedDestinationsListView = useSelector(state => state.selectedDestinationsListView)

  const listview_selectByCodeDestinations = useSelector(state => state.listview_selectByCodeDestinations)

  const listview_selectByCategoryDestinations = useSelector(state => state.listview_selectByCategoryDestinations)

  const listview_selectBy_DestinationsVisibility = useSelector(state => state.listview_selectBy_DestinationsVisibility)

  const uploadingCSVNotification = useSelector(state => state.uploadingCSVNotification)

  const uploadCSVDoneNotification = useSelector(state => state.uploadCSVDoneNotification)

  const [showUploadCSVModal, setShowUploadCSVModal] = useState(false)

  const setModalVisibility = value => setShowUploadCSVModal(value)

  const uploadButtonRef = useRef()

  const buttonContainerRef = useRef()

  const [buttonContainerBottom, setButtonContainerBottom] = useState(0)

  const computeButtonContainerBottom = () => {
    return getComputedStyle(uploadButtonRef.current, null).getPropertyValue('height')
  }

  const handleGenerateMapClick = () => {
    if (selectedDestinationsListView.length > 0) {
      props.history.push('/generate-listview')
    }
  }

  const clearList = () => {
    batch(() => {
      dispatch({ type: REMOVE_ORIGIN_LISTVIEW })
      dispatch({ type: REMOVE_ALL_DESTINATIONS_LISTVIEW })
    })
  }

  useEffect(() => {
    if (!checkAuth()) setTimeout(() => props.history.push('/'))
    else {
      // console.log('user is logged in')
      // dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
      // dispatch({ type: SELECTED_FILE_TYPE, payload: 'PNG' })
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
      <div className='row' style={{ whiteSpace:'nowrap' }}>
        <UserLeftSidePanel/>
        <div className='col-med panel-style' style={{ width:'300px', height:'100vh' }}>
          <div style={{
                width: '100%', height: '100%',
                position: 'relative',
              }}>
            <div style={{ margin: '10% 0 0 10%' }}>
              <div className='map-type-title'>
                List View
              </div>
            </div>
            <br/>
            <span style={{ position: 'absolute', left: '10%', margin: 'auto', width: '100px', marginTop: '5%' }}>
              <DropdownGraphicStyle overrideStyle={{ fontSize: '1.5rem' }}>
                {
                  !selectedOriginListView
                  ? <>Origin Airport</>
                : selectedOriginListView.city
                }
              </DropdownGraphicStyle>
            </span>
            <span style={{ opacity: '0.001' }}>
              <Dropdown type='code' output='listview-origin'/>
            </span>
            <div ref={buttonContainerRef}
                 className='button-container'
                 style={{
                   bottom: buttonContainerBottom,
                   width: '60%', margin: 'auto',
                   left: 0, right: 0, position: 'absolute'
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
                  border: selectedOriginListView && selectedDestinationsListView.length > 0 ? 'none' : '1px solid #e8e8e8',
                  pointerEvents: selectedOriginListView && selectedDestinationsListView.length > 0 ? 'all' : 'none',
                  color: selectedOriginListView && selectedDestinationsListView.length > 0 ? 'white' : '#fff',
                  backgroundColor: selectedOriginListView && selectedDestinationsListView.length > 0 ? 'red' : '#e8e8e8'
                }}>
                Generate List View
              </button>
              <br/>
              {
                selectedOriginListView && selectedDestinationsListView.length > 0
                ?
                  (<button
                    className='clear-list-button'
                    onClick={clearList}
                    style={{}}>
                    Clear List
                  </button>)
                : null
              }
              <br/>
            </div>
          </div>
        </div>
        <CSSTransition
          in={selectedOriginListView != null}
          unmountOnExit
          classNames='slide'
          timeout={300}>
          <div className='col-med'>
            <SelectionView type='listview-destinations'/>
          </div>
        </CSSTransition>
        {
          selectedOriginListView != null && listview_selectByCodeDestinations
          ?
           <CSSTransition
             in={listview_selectBy_DestinationsVisibility}
             unmountOnExit
             classNames='slide'
             timeout={300}>
             <div
               className='col-med panel-style'
               style={{ minWidth: '200px', padding: '20px 20px 0 20px' }}>
               <Dropdown type='code' output='listview-destinations'/>
             </div>
          </CSSTransition> : null
        }
        {
          selectedOriginListView != null && listview_selectByCategoryDestinations
          ?
           <CSSTransition
             in={listview_selectByCategoryDestinations}
             unmountOnExit
             classNames='slide'
             timeout={300}>
             <div
               className='col-med panel-style'
               style={{ minWidth: '200px', padding: '20px 20px 0 20px' }}>
               <Dropdown type='category' output='listview-destinations'/>
             </div>
          </CSSTransition> : null
        }
      </div>
      <CSSTransition
        in={showUploadCSVModal}
        unmountOnExit
        timeout={300}
        classNames='alert'>
        <UploadModal type='listview' setModalVisibility={setShowUploadCSVModal} />
      </CSSTransition>
    </>
  )

}

export default withRouter(ListView)
