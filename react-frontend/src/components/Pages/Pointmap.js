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
import UploadModal from '../Forms/UploadModal'
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
  HIDE_DESTINATION_PANEL_POINTMAP
} from '../../constants/pointmap'

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

  const [showUploadCSVModal, setShowUploadCSVModal] = useState(false)

  const setModalVisibility = value => {
    setShowUploadCSVModal(value)
  }

  const uploadButtonRef = useRef()

  const buttonContainerRef = useRef()

  const [buttonContainerBottom, setButtonContainerBottom] = useState(0)

  const computeButtonContainerBottom = () => {
    return getComputedStyle(uploadButtonRef.current, null).getPropertyValue('height')
  }

  const handleGenerateMapClick = () => {
    if (selectedDestinationsPointmap) {
      props.history.push('/generate-pointmap')
    }
  }

  useEffect(() => {
    if (!checkAuth()) {
      setTimeout(() => props.history.push('/'))
    } else {
      console.log('user is logged in')
      setButtonContainerBottom(computeButtonContainerBottom())
    }
  }, [])

  return (
    <>
      <div className='row' style={{whiteSpace:'nowrap'}}>
          <UserLeftSidePanel/>
          <div
            className='col-med'
            style={{
              width:'300px',
              height:'100vh',
              backgroundColor: '#fff',
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
                  margin: '10% 0 0 10%',
                }}>
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
                  width: '70%',
                  margin: 'auto',
                  left: 0, right: 0,
                  position: 'absolute',
                }}>
                <button
                  onClick={() => setShowUploadCSVModal(true) }
                  style={{
                    height:'60px',
                    width: '100%',
                    padding: '0 20px 0 20px',
                    margin: '0 0 10px 0',
                    border: 'none',
                    borderRadius: '5px',
                    backgroundColor: 'red',
                    color: '#fff'
                  }}>
                  Upload CSV
                </button>
                <br/>
                <button
                  ref={uploadButtonRef}
                  onClick={handleGenerateMapClick}
                  style={{
                    height:'60px',
                    width: '100%',
                    padding: '0 20px 0 20px',
                    border: selectedOriginsPointmap && selectedDestinationsPointmap ? 'none' : '1px solid #CCC',
                    borderRadius: '5px',
                    pointerEvents: selectedOriginsPointmap && selectedDestinationsPointmap ? 'all' : 'none',
                    color: selectedOriginsPointmap && selectedDestinationsPointmap ? 'white' : '#CCC',
                    backgroundColor: selectedOriginsPointmap && selectedDestinationsPointmap ? 'red' : 'white'
                  }}>
                  Generate Pointmap
                </button>
              </div>
            </div>
          </div>
        {
          pointmap_destinationPanelVisibility
          ?
           (<div className='col-med'>
             <SelectionView type='pointmap-destinations'/>
           </div>)
          : null
        }
        {
          pointmap_selectBy_OriginsVisibility
          ?
            <SelectBy_Origins type='pointmap'/>
          : null
        }
        {
          pointmap_selectByCodeOrigins == true
          ?
           (<>
             <div className='col-med'
               style={{
                 width:'300px',
                 height:'100vh',
                 backgroundColor: '#fff',
                 boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
                 padding: '20px 20px 0 20px',
               }}>
               {/*<div>select Origins by airport code: &nbsp;</div>*/}
               <Dropdown type='code' output='pointmap-origins'/>
             </div>
           </>) : null
        }
        {
          pointmap_selectByCategoryOrigins == true
          ?
           (<>
             <div className='col-med' style={{
                 width:'300px',
                 height:'100vh',
                 backgroundColor: '#fff',
                 boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
                 padding: '20px 20px 0 20px',
               }}>
               {/*<div>select Origins by airport code: &nbsp;</div>*/}
               <Dropdown type='category' output='pointmap-origins'/>
             </div>
           </>) : null
        }
        {
          pointmap_selectBy_DestinationsVisibility ? <SelectBy_Destinations_Pointmap/> : null
        }
        {
          pointmap_selectByCodeDestinations == true
          ?
           (<>
             <div
               className='col-med'
               style={{
                 width:'300px',
                 height:'100vh',
                 backgroundColor: '#fff',
                 boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
                 padding: '20px 20px 0 20px',
               }}>
               {/*<div>select Destinations by airport code: &nbsp;</div>*/}
               <Dropdown type='code' output='pointmap-destinations'/>
             </div>
            </>)
          : null
        }
        {
          pointmap_selectByCategoryDestinations == true
          ?
           (<>
             <div
               className='col-med'
               style={{
                 width:'300px',
                 height:'100vh',
                 backgroundColor: '#fff',
                 boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
                 padding: '20px 20px 0 20px',
               }}>
               {/*<div>select Destinations by category: &nbsp;</div>*/}
               <Dropdown type='category' output='pointmap-destinations'/>
             </div>
            </>)
          : null
        }
      </div>
      {
        showUploadCSVModal
        ?
          <UploadModal type='pointmap' setModalVisibility={setShowUploadCSVModal} />
        : null
      }
    </>
  )

}

export default withRouter(Pointmap)
