import React, { useEffect, useState, useRef, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  SET_ORIGIN_LISTVIEW,
  SET_DESTINATION_LOCATIONS_LISTVIEW
} from '../../constants/listview'
import {
  SET_ORIGIN_LOCATIONS_POINTMAP,
  SET_DESTINATION_LOCATIONS_POINTMAP,
} from '../../constants/pointmap'
import {
  SET_ORIGIN_SPIDERMAP,
  SET_DESTINATION_LOCATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP
} from '../../constants/spidermap'
import {
  SET_ALL_CODES
} from '../../constants/constants'
import SelectBy_Origins from '../Views/SelectBy_Origins'
import SelectBy_Destinations_Pointmap from '../Views/SelectBy_Destinations_Pointmap'
import SelectBy_Destinations_Spidermap from '../Views/SelectBy_Destinations_Spidermap'
import SelectBy_Destinations_ListView from '../Views/SelectBy_Destinations_ListView'
import { checkAuth, getUser } from '../../sessionStore'
import url from '../../url'
import axios from 'axios'
import _ from 'lodash'
import './dropdown.scss'
import '../Buttons/buttons.scss'

const Dropdown = ({ ...props }) => {

  const { type } = props

  const data = useSelector(state => state.allCodesData)

  const [selection, setSelection] = useState([])

  const [options, setOptions] = useState([])

  const [airportsPerCategory, setAirportsPerCategory] = useState({})

  const [values, setValues] = useState([])

  const dispatch = useDispatch()

  const selectedOriginListView = useSelector(state => state.selectedOriginListView)

  const selectedOriginSpidermap = useSelector(state => state.selectedOriginSpidermap)

  const selectedOriginsPointmap = useSelector(state => state.selectedOriginsPointmap)

  const selectedDestinationsListView = useSelector(state => state.selectedDestinationsListView)

  const selectedDestinationsSpidermap = useSelector(state => state.selectedDestinationsSpidermap)

  const selectedDestinationsPointmap = useSelector(state => state.selectedDestinationsPointmap)

  const currentlySelectedOriginPointmap = useSelector(state => state.currentlySelectedOriginPointmap)

  const allCodesData = useSelector(state => state.allCodesData)

  const [_filter, setFilter] = useState('')

  useEffect(() => {
    if (checkAuth()) {
      if (options.length == 0) {
        if (props.type == 'code') createOptionsFromCodes()
        else if (props.type == 'category') createOptionsFromCategory()
      }
    }
  }, [props.type])

  const createOptionsFromCodes = async () => {
    try {
      let resultArr
      if (!allCodesData) {
        let result = await axios.get(`/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
        dispatch({ type: SET_ALL_CODES, payload: result.data })
        resultArr = result.data.map(ap => {
          if (ap.code != null) {
            return (<Fragment key={ap.code}>
                      <option value={ap.code}>{ap.code} - {ap.city} - {ap.region}</option>
                    </Fragment>)
          }
        })
        setOptions(resultArr)
      } else {
        resultArr = allCodesData.map(ap => {
          if (ap.code != null) {
            return (<Fragment key={ap.code}>
                      <option value={ap.code}>{ap.code} - {ap.city} - {ap.region}</option>
                    </Fragment>)
          }
        })
        setOptions(resultArr)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const createOptionsFromCategory = async () => {
    try {
      let apPerCategory = {}
      if (!allCodesData) {
        let result = await axios.get(`/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
        dispatch({ type: SET_ALL_CODES, payload: result.data })
        // get category fields, then sort alphabetically
        let categories = result.data.map(ap => ap.category).sort((a,b) => {
          if (a < b) return -1
          if (a > b) return 1
          return 0
        })
        result.data.forEach(ap => {
          if (!apPerCategory[ap.category]) apPerCategory[ap.category] = []
          apPerCategory[ap.category].push(ap)
        })
        setAirportsPerCategory(apPerCategory) // setting default after data load
        // display categories in options dropdown
        let filteredCategories = categories.filter((c, i) => categories.indexOf(c) == i)
        let options = filteredCategories.map(item => <Fragment key={item}><option value={item}>{item}</option></Fragment>)
        setOptions(options)
      } else {
        let categories = allCodesData.map(ap => ap.category).sort((a,b) => {
          if (a < b) return -1
          if (a > b) return 1
          return 0
        })
        allCodesData.forEach(ap => {
          if (!apPerCategory[ap.category]) apPerCategory[ap.category] = []
          apPerCategory[ap.category].push(ap)
        })
        setAirportsPerCategory(apPerCategory) // setting default after data load
        // display categories in options dropdown
        let filteredCategories = categories.filter((c, i) => categories.indexOf(c) == i)
        let options = filteredCategories.map(item => <Fragment key={item}><option value={item}>{item}</option></Fragment>)
        setOptions(options)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const dispatchProperOutputType = (item, value, property, outputType) => {
    if (item[property] == value) {
      if (outputType == 'listview-origin') {
        dispatch({ type: SET_ORIGIN_LISTVIEW, payload: item })
      }
      if (outputType == 'spidermap-origin') {
        dispatch({ type: SET_ORIGIN_SPIDERMAP, payload: item })
      }
      if (outputType == 'pointmap-origins') {
        if (_.some(selectedOriginsPointmap, item) == false) {
          dispatch({ type: SET_ORIGIN_LOCATIONS_POINTMAP, payload: item })
        }
      }
      if (outputType == 'listview-destinations') {
        if (_.some(selectedDestinationsListView, item) == false) {
          dispatch({ type: SET_DESTINATION_LOCATIONS_LISTVIEW, payload: { origin: selectedOriginListView, item } })
        }
      }
      if (outputType == 'spidermap-destinations') {
        if (_.some(selectedDestinationsSpidermap, item) == false) {
          dispatch({ type: SET_DESTINATION_LOCATIONS_SPIDERMAP, payload: { origin: selectedOriginSpidermap, item } })
        }
      }
      if (outputType == 'pointmap-destinations') {
        if (currentlySelectedOriginPointmap && selectedDestinationsPointmap) {
          if (_.some(selectedDestinationsPointmap[currentlySelectedOriginPointmap], item) == false) {
            dispatch({ type: SET_DESTINATION_LOCATIONS_POINTMAP, payload: { origin: currentlySelectedOriginPointmap, item } })
          }
        }
      }
    }
  }

  const setSingleSelection = (value, outputType) => {
    data.forEach(item => {
      dispatchProperOutputType(item, value, 'code', outputType)
    })
  }

  const setCategorySelection = (value, outputType) => {
    let category = airportsPerCategory[value]
    category.forEach(item => {
      dispatchProperOutputType(item, value, 'category', outputType)
    })
  }

  const setOptionsValues = e => {
    let { selectedOptions } = e.target
    selectedOptions = [].slice.call(selectedOptions)
    selectedOptions = selectedOptions.map(option => option.value)
    setValues(selectedOptions)
  }

  const selectionHandlerSingleOrigin = e => {
    if (type == 'code') {
      setSingleSelection(e.target.value, props.output)
    }
  }

  const selectionHandler = () => {
    if (type == 'code') {
      values.forEach(val => {
        setSingleSelection(val, props.output)
      })
    }
    else if (type == 'category') {
      values.forEach(val => {
        setCategorySelection(val, props.output)
      })
    }
    dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP })
  }

  return (
    <>
     {
       props.output == 'spidermap-origin'
       ?
        (<>
          {
            allCodesData
            ?
              (<>
                <div className='subtitle' style={{ margin:'0 0 0 10%' }}>Origin Airport</div>
                  <select className='scrollable'
                          value={ selectedOriginSpidermap ? selectedOriginSpidermap.code : '' }
                          style={{
                            display:'block',
                            backgroundColor: '#fff',
                            margin: '0 10% 0 10%',
                            width:'80%',
                          }}
                          onChange={ selectionHandlerSingleOrigin }>
                          <option></option>
                          {options}
                  </select>
                </>)
              : <div
                  className='loading-text'
                  style={{ marginLeft: '20px' }}>loading data...</div>
            }
          </>)
        :
            props.output == 'listview-origin'
            ?
              (<>
                {
                  allCodesData
                  ?
                    (<select
                        className='scrollable'
                        value={ selectedOriginListView ? selectedOriginListView.code : '' }
                        style={{
                          display:'block',
                          backgroundColor: '#fff',
                          margin: '0 10% 0 10%',
                          width:'80%',
                        }}
                        onChange={ selectionHandlerSingleOrigin }>
                        <option></option>
                        {options}
                    </select>)
                  : <div
                      className='loading-text'
                      style={{ marginLeft: '20px' }}>loading data...</div>
                }
              </>)
            :
              (<>
                {
                  allCodesData
                  ?
                    (<>
                      <div style={{ marginLeft: '10px', display: 'inline-block' }}>
                        Filter: &nbsp;
                      </div>
                      <input
                        style={{ borderRadius: '3px', width: '350px' }}
                        value={_filter} onChange={e => setFilter(e.target.value)}/><br/><br/>
                      {
                        props.output == 'listview-destinations'
                        ? <SelectBy_Destinations_ListView/>
                        :
                          props.output == 'spidermap-destinations'
                          ? <SelectBy_Destinations_Spidermap/>
                          :
                            props.output == 'pointmap-destinations'
                            ? <SelectBy_Destinations_Pointmap/>
                            :
                              props.output == 'pointmap-origins'
                              ? <SelectBy_Origins_Pointmap/>
                              : null
                      }
                      <select
                        className='multi scrollable'
                        style={{ margin: '0 0 0 10px', height:'70%', width:'450px'}}
                        onChange={ setOptionsValues }
                        multiple={ 'multiple' }>
                        <option></option>
                        {
                          options.filter(opt => {
                            if (type == 'code' && opt.props.children.props.children.join('').toLowerCase().indexOf(_filter) > -1) {
                              return opt
                            } else if (type == 'category' && opt.props.children.props.value.toLowerCase().indexOf(_filter) > -1) {
                              return opt
                            }
                          })
                        }
                      </select>
                    </>)
                  : <div
                      className='loading-text'
                      style={{ textAlign: 'center' }}>loading data...</div>
                }
              </>)
      }
      {
          (props.output == 'spidermap-origin' ||
           props.output == 'listview-origin' || !allCodesData)
            ? null
            : (<>
                <div style={{ fontSize:'.75rem', textAlign:'center' }}>
                  Hold CTRL / ⌘ to select multiple
                </div><br/><br/>
                <button
                  className='check-button'
                  onClick={selectionHandler}
                  style={{ margin: '0 0 0 10px', width:'90%' }}>
                  <div className='check-button-inner'>
                    <div className='check-button-inner-text'>
                      √
                    </div>
                  </div>
                </button>
              </>)
      }
    </>
  )

}

export default Dropdown
