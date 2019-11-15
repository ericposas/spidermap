import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import UploadForm from '../Forms/UploadForm'
import BackButton from '../Buttons/BackButton'
import SelectBy_Destinations_Spidermap from '../Views/SelectBy_Destinations_Spidermap'
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

  useEffect(() => {
    if (!checkAuth()) {
      setTimeout(() => props.history.push('/'))
    } else {
      console.log('user is logged in')
    }
  }, [])

  return (
    <>
      <BackButton/>
      <br/>
      <br/>
      <br/>
      <UploadForm type='spidermap'/>
      <br/>
      <br/>
      <div>Create a Spidermap</div>
      <br/>
      <div className='row'>
        <div className='col-med'>
          <div style={{margin:'0 0 0 20px'}}>select Origin by airport code: &nbsp;</div>
          <Dropdown type='code' output='spidermap-origin'/>
        </div>
        <div>
          <SelectionView type='spidermap-origin'/>
        </div>
        {
          selectedOriginSpidermap
          ?
            (<div>
              <SelectionView type='spidermap-destinations'/>
             </div>) : null
        }
        {
          spidermap_selectBy_DestinationsVisibility && selectedOriginSpidermap
          ? <SelectBy_Destinations_Spidermap/>
          : null
        }
        {
          spidermap_selectByCodeDestinations && selectedOriginSpidermap
          ?
           (<>
             <div className='col-med' style={{height:'100vh',margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Destinations by airport code: &nbsp;</div>
               <Dropdown type='code' output='spidermap-destinations'/>
             </div>
            </>)
          : null
        }
        {
          spidermap_selectByCategoryDestinations && selectedOriginSpidermap
          ?
           (<>
             <div className='col-med' style={{height:'100vh',margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Destinations by category: &nbsp;</div>
               <Dropdown type='category' output='spidermap-destinations'/>
             </div>
            </>)
          : null
        }
        {
          selectedOriginSpidermap && selectedDestinationsSpidermap.length > 0
          ?
            (<button onClick={() => { props.history.push('/generate-spidermap') }}
                     style={{height:'60px',margin:'0 0 0 20px'}}>
              Generate Spidermap
            </button>)
          : null
        }
      </div>
    </>
  )

}

export default withRouter(Spidermap)
