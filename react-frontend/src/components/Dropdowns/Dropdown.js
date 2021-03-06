import React, { useEffect, useState, useRef, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  SET_ORIGIN_LISTVIEW,
  SET_DESTINATION_LOCATIONS_LISTVIEW,
} from '../../constants/listview'
import {
  SET_ORIGIN_LOCATIONS_POINTMAP,
  SET_DESTINATION_LOCATIONS_POINTMAP,
} from '../../constants/pointmap'
import {
  SET_ORIGIN_SPIDERMAP,
  SET_DESTINATION_LOCATIONS_SPIDERMAP,
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
import '../../images/checkmark-hi.png'
import '../../images/checkmark-plain.png'
// import alphaSort from 'alpha-sort'

const Dropdown = ({ ...props }) => {

  const { type } = props

  const data = useSelector(state => state.allCodesData)

  const [selection, setSelection] = useState([])

  const [options, setOptions] = useState([])

  // const [chosenCategories, setChosenCategories] = useState([])

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

  let chosenCategories = []

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
        let sorted = result.data
          .map(ap => ap.code)
          .sort((a,b) => {
            if (a < b) return -1
            if (a > b) return 1
            return 0
          })
        let _sorted = []
        sorted.forEach(code => {
          result.data.forEach(obj => { if (obj.code == code) _sorted.push(obj) })
        })
        resultArr = _sorted.map(ap => {
          if (ap.code != null) {
            return (<Fragment key={ap.code}>
                      <option value={ap.code}>{ap.code} - {ap.city} - {ap.region}</option>
                    </Fragment>)
          }
        })
        dispatch({ type: SET_ALL_CODES, payload: _sorted })
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
        let categories = []
        result.data.forEach((ap) => {
            ap.categories.split(',')
              .forEach((item, i) => {
                categories.push(item.trim())
              })
        })
        categories = categories.sort((a,b) => {
          if (a < b) return -1
          if (a > b) return 1
          return 0
        })
        categories = categories.filter((cat, idx) => idx == categories.indexOf(cat))
        result.data.forEach((ap, i) => {
          categories.forEach((category, i) => {
            // console.log(categories, category)
            let arr = ap.categories.split(',').map(item => item.trim())
            if (arr.includes(category)) {
              // console.log(category)
              if (!apPerCategory[category]) apPerCategory[category] = []
              apPerCategory[category].push(ap)
            }
          })
        })
        // categories = categories.filter((cat, idx) => idx == categories.indexOf(cat))
        // console.log(categories)
        // result.data.forEach(ap => {
        //   if (!apPerCategory[ap.category]) apPerCategory[ap.category] = []
        //   apPerCategory[ap.category].push(ap)
        // })

        setAirportsPerCategory(apPerCategory) // setting default after data load
        // display categories in options dropdown
        // let filteredCategories = categories.filter((c, i) => categories.indexOf(c) == i)
        let options = categories.map(item => <Fragment key={item}><option value={item}>{item}</option></Fragment>)
        setOptions(options)
      } else {
        let categories = []
        allCodesData.forEach((ap) => {
            ap.categories.split(',')
              .forEach((item, i) => {
                categories.push(item.trim())
              })
        })
        categories = categories.sort((a,b) => {
          if (a < b) return -1
          if (a > b) return 1
          return 0
        })
        categories = categories.filter((cat, idx) => idx == categories.indexOf(cat))
        allCodesData.forEach((ap, i) => {
          categories.forEach((category, i) => {
            let arr = ap.categories.split(',').map(item => item.trim())
            if (arr.includes(category)) {
              if (!apPerCategory[category]) apPerCategory[category] = []
              apPerCategory[category].push(ap)
            }
          })
        })
        // apPerCategory[category] = apPerCategory[category].filter((item, idx) => idx == apPerCategory[category].indexOf(item))
        // console.log(apPerCategory)
        // let categories = allCodesData.map(ap => ap.category).sort((a,b) => {
        //   if (a < b) return -1
        //   if (a > b) return 1
        //   return 0
        // })
        // allCodesData.forEach(ap => {
        //   if (!apPerCategory[ap.category]) apPerCategory[ap.category] = []
        //   apPerCategory[ap.category].push(ap)
        // })
        setAirportsPerCategory(apPerCategory) // setting default after data load
        // display categories in options dropdown
        // let filteredCategories = categories.filter((c, i) => categories.indexOf(c) == i)
        let options = categories.map(item => <Fragment key={item}><option value={item}>{item}</option></Fragment>)
        setOptions(options)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const dispatchProperOutputType = (item, value, property, outputType) => {
    // console.log(item, property, value)
    // console.log('item[property]: ' + item[property], 'value: ' + value);
    // console.log(property, value)
    if (item[property] == value || (value == null && typeof property == 'object')) {
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

  // const setCategorySelection = (value, outputType) => {
  //   let category = airportsPerCategory[value]
  //   category.forEach(item => {
  //     chosenCategories = chosenCategories.concat(item)
  //     chosenCategories = chosenCategories.filter((_item, idx) => idx == chosenCategories.indexOf(_item))
  //   })
  // }

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
        // setCategorySelection(val, props.output)
        let category = airportsPerCategory[val]
        category.forEach(item => {
          chosenCategories = chosenCategories.concat(item)
          chosenCategories = chosenCategories.filter((_item, idx) => idx == chosenCategories.indexOf(_item))
        })
      })
      // setTimeout(() => {
      chosenCategories.forEach(item => {
        dispatchProperOutputType(item, null, item, props.output)
      })
    }
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
                            margin: '0 10% 0 0',
                            width:'350px',
                            opacity: '0.001'
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
                          width:'350px',
                          opacity: '0.001',
                          zIndex: 1,
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
                        className='filter'
                        style={{
                          border: '1px solid #ccc', borderRadius: '3px',
                          width: '200px', zIndex: 1,
                        }}
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
                              ? <SelectBy_Origins/>
                              : null
                      }
                      <select
                        className='multi scrollable'
                        style={{
                          margin: '0 0 0 10px', height:'70%',
                          width:'400px', zIndex: 1,
                        }}
                        onChange={ setOptionsValues }
                        multiple={ 'multiple' }>
                        <option></option>
                        {
                          options
                          .sort((a,b) => {
                            if (a < b) return -1
                            if (a > b) return 1
                            return 0
                          })
                          .filter(opt => {
                            if (type == 'code' && (opt.props.children.props.children.join('').toLowerCase().indexOf(_filter) > -1 ||
                                                   opt.props.children.props.children.join('').toUpperCase().indexOf(_filter) > -1 ||
                                                   opt.props.children.props.children.join('').indexOf(_filter) > -1)) {
                              return opt
                            } else if (type == 'category' && opt.key.toLowerCase().indexOf(_filter) > -1) {
                              // console.log(opt)
                              return opt
                               // && opt.props.children.props.value.toLowerCase().indexOf(_filter) > -1
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
                <div style={{ fontSize:'.75rem', color: '#ccc', marginLeft: '10px' }}>
                  <div style={{ paddingBottom: '5px' }}></div>
                  Hold CTRL / ⌘ to select multiple
                </div><br/><br/>
                <button
                  className='check-button'
                  onClick={selectionHandler}
                  style={{ margin: '0 0 0 10px', width:'90%' }}>
                  <img
                    className='check-button-image'
                    style={{ marginTop: '-40px', width: '80px' }}
                    src='./img/checkmark-hi.png'
                    />
                </button>
              </>)
      }
    </>
  )

}

export default Dropdown
