import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
// import UploadForm from '../Forms/UploadForm'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import SelectBy_Destinations_Spidermap from '../Views/SelectBy_Destinations_Spidermap'
import UploadModal from '../Forms/UploadModal'
import { checkAuth } from '../../sessionStore'
import { LAST_LOCATION } from '../../constants/constants'

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

  useEffect(() => {
    if (!checkAuth()) setTimeout(() => props.history.push('/'))
    else console.log('user is logged in')
  }, [])

  return (
    <>
      <div className='row' style={{whiteSpace:'nowrap'}}>
        <UserLeftSidePanel/>
        <div className='col-med' style={{width:'300px'}}>
          <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                backgroundColor: 'lightblue'
            }}>
            <Dropdown type='code' output='spidermap-origin'/>
            <div style={{
                margin: 'auto',
                bottom: '1%',
                width: '70%',
                left: 0, right: 0,
                position: 'absolute',
                backgroundColor: 'green'
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
                  color: 'white'
                }}>
                Upload CSV
              </button>
              <br/>
              <button
                onClick={() => { if (selectedDestinationsSpidermap.length > 0) props.history.push('/generate-spidermap') }}
                style={{
                  height:'60px',
                  width: '100%',
                  padding: '0 20px 0 20px',
                  border: selectedOriginSpidermap && selectedDestinationsSpidermap.length > 0 ? 'none' : '1px solid #CCC',
                  borderRadius: '5px',
                  pointerEvents: selectedOriginSpidermap && selectedDestinationsSpidermap.length > 0 ? 'all' : 'none',
                  color: selectedOriginSpidermap && selectedDestinationsSpidermap.length > 0 ? 'white' : '#CCC',
                  backgroundColor: selectedOriginSpidermap && selectedDestinationsSpidermap.length > 0 ? 'red' : 'white'
                }}>
                Generate Spidermap
              </button>
            </div>
          </div>
        </div>
        <div className='col-med' style={{}}>
          <SelectionView type='spidermap-origin'/>
        </div>
        {
          selectedOriginSpidermap
          ?
            (<div className='col-med'>
              <SelectionView type='spidermap-destinations'/>
             </div>) : null
        }
        {
          spidermap_selectBy_DestinationsVisibility && selectedOriginSpidermap
          ? <SelectBy_Destinations_Spidermap/>
          : null
        }
        {
          spidermap_selectByCodeDestinations && selectedOriginSpidermap && spidermap_selectBy_DestinationsVisibility
          ?
           (<>
             <div className='col-med' style={{margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Destinations by airport code: &nbsp;</div>
               <Dropdown type='code' output='spidermap-destinations'/>
             </div>
            </>)
          : null
        }
        {
          spidermap_selectByCategoryDestinations && selectedOriginSpidermap && spidermap_selectBy_DestinationsVisibility
          ?
           (<>
             <div className='col-med' style={{margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Destinations by category: &nbsp;</div>
               <Dropdown type='category' output='spidermap-destinations'/>
             </div>
            </>)
          : null
        }
      </div>
      {
        showUploadCSVModal ? <UploadModal setModalVisibility={setShowUploadCSVModal} modalVisibility={showUploadCSVModal}/> : null
      }
    </>
  )

}

export default withRouter(Spidermap)
