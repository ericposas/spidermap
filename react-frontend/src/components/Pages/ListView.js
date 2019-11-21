import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import BackButton from '../Buttons/BackButton'
import SelectBy_Destinations_ListView from '../Views/SelectBy_Destinations_ListView'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import { checkAuth } from '../../sessionStore'
import { LAST_LOCATION } from '../../constants/constants'

const Spidermap = ({ ...props }) => {

  const dispatch = useDispatch()

  const lastLocation = useSelector(state => state.lastLocation)

  const selectedOriginListView = useSelector(state => state.selectedOriginListView)

  const selectedDestinationsListView = useSelector(state => state.selectedDestinationsListView)

  const listview_selectBy_DestinationsVisibility = useSelector(state => state.listview_selectBy_DestinationsVisibility)

  const listview_selectByCodeDestinations = useSelector(state => state.listview_selectByCodeDestinations)

  const listview_selectByCategoryDestinations = useSelector(state => state.listview_selectByCategoryDestinations)

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
    if (selectedDestinationsListView.length > 0) {
      props.history.push('/generate-listview')
    }
  }
  
  useEffect(() => {
    if (!checkAuth()) setTimeout(() => props.history.push('/'))
    else {
      console.log('user is logged in')
      setButtonContainerBottom(computeButtonContainerBottom())
    }
  }, [])

  return (
    <>
      <div className='row' style={{whiteSpace:'nowrap'}}>
        <UserLeftSidePanel/>
        <div className='col-med' style={{
            width:'300px',
            height:'100vh',
            backgroundColor: '#fff',
            boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
          }}>
          <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
            }}>
            <div style={{
                margin: '10% 0 0 10%',
              }}>
              <div className='map-type-title'>
                List View
              </div>
            </div>
            <br/>
            <Dropdown type='code' output='listview-origin'/>
            <div ref={buttonContainerRef}
                 className='button-container'
                 style={{
                   bottom: buttonContainerBottom,
                   width: '70%',
                   margin: 'auto',
                   left: 0, right: 0,
                   position: 'absolute',
                }}>
              <button
                onClick={() => {
                  setShowUploadCSVModal(true)
                }}
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
                  border: selectedOriginListView && selectedDestinationsListView.length > 0 ? 'none' : '1px solid #CCC',
                  borderRadius: '5px',
                  pointerEvents: selectedOriginListView && selectedDestinationsListView.length > 0 ? 'all' : 'none',
                  color: selectedOriginListView && selectedDestinationsListView.length > 0 ? 'white' : '#CCC',
                  backgroundColor: selectedOriginListView && selectedDestinationsListView.length > 0 ? 'red' : 'white'
                }}>
                Generate List View
              </button>
            </div>
          </div>
        </div>
        {
          selectedOriginListView
          ?
            (<div className='col-med'>
              <SelectionView type='listview-destinations'/>
             </div>) : null
        }
        {
          listview_selectBy_DestinationsVisibility && selectedOriginListView
          ? <SelectBy_Destinations_ListView/>
          : null
        }
        {
          listview_selectByCodeDestinations && selectedOriginListView && listview_selectBy_DestinationsVisibility
          ?
           (<>
             <div
               className='col-med'
               style={{
                 minWidth: '200px',
                 padding: '20px 20px 0 20px',
                 backgroundColor: '#fff',
                 boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
               }}>
               <Dropdown type='code' output='listview-destinations'/>
             </div>
            </>)
          : null
        }
        {
          listview_selectByCategoryDestinations && selectedOriginListView && listview_selectBy_DestinationsVisibility
          ?
           (<>
             <div
               className='col-med'
               style={{
                 minWidth: '200px',
                 padding: '20px 20px 0 20px',
                 backgroundColor: '#fff',
                 boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
               }}>
               <Dropdown type='category' output='listview-destinations'/>
             </div>
            </>)
          : null
        }
      </div>
      {
        showUploadCSVModal ? <UploadModal type='listview' setModalVisibility={setShowUploadCSVModal} /> : null
      }
    </>
  )

}

export default withRouter(Spidermap)
