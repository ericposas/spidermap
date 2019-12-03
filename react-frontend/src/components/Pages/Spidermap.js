import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import SelectBy_Destinations_Spidermap from '../Views/SelectBy_Destinations_Spidermap'
import UploadModal from '../Modals/UploadModal'
import { checkAuth } from '../../sessionStore'
import { LAST_LOCATION } from '../../constants/constants'
import {
  CLEAR_ORIGIN_SPIDERMAP,
  SET_ORIGIN_SPIDERMAP,
  REMOVE_ALL_DESTINATIONS_SPIDERMAP,
} from '../../constants/spidermap'

const Spidermap = ({ ...props }) => {

  const dispatch = useDispatch()

  const lastLocation = useSelector(state => state.lastLocation)

  const selectedOriginSpidermap = useSelector(state => state.selectedOriginSpidermap)

  const selectedDestinationsSpidermap = useSelector(state => state.selectedDestinationsSpidermap)

  const spidermap_selectBy_DestinationsVisibility = useSelector(state => state.spidermap_selectBy_DestinationsVisibility)

  const spidermap_selectByCodeDestinations = useSelector(state => state.spidermap_selectByCodeDestinations)

  const spidermap_selectByCategoryDestinations = useSelector(state => state.spidermap_selectByCategoryDestinations)

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
    if (selectedDestinationsSpidermap.length > 0) {
      dispatch({ type: LAST_LOCATION, payload: 'spidermap' })
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
      console.log('user is logged in')
      dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
      setButtonContainerBottom(computeButtonContainerBottom())
    }
  }, [])

  return (
    <>
      <div className='row' style={{whiteSpace:'nowrap'}}>
        <UserLeftSidePanel/>
        <div className='col-med panel-style'
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
            <Dropdown type='code' output='spidermap-origin'/>
            <div ref={buttonContainerRef}
                 className='button-container'
                 style={{
                   bottom: buttonContainerBottom,
                   width: '70%', margin: 'auto',
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
        {
          selectedOriginSpidermap
          ?
            (<div className='col-med'>
              <SelectionView type='spidermap-destinations'/>
             </div>) : null
        }
        {
          spidermap_selectByCodeDestinations && selectedOriginSpidermap
          ?
           (<>
             <div
               className='col-med panel-style'
               style={{
                 minWidth: '200px', padding: '20px 20px 0 20px',
               }}>
               <Dropdown type='code' output='spidermap-destinations'/>
             </div>
            </>)
          : null
        }
        {
          spidermap_selectByCategoryDestinations && selectedOriginSpidermap
          ?
           (<>
             <div
               className='col-med panel-style'
               style={{
                 minWidth: '200px', padding: '20px 20px 0 20px',
               }}>
               <Dropdown type='category' output='spidermap-destinations'/>
             </div>
            </>)
          : null
        }
      </div>
      {
        showUploadCSVModal ? <UploadModal type='spidermap' setModalVisibility={setShowUploadCSVModal} /> : null
      }
    </>
  )

}

export default withRouter(Spidermap)
