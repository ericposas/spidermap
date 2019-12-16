import React, { useRef, useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import DownloadImagePanel from '../Views/DownloadAndSavePanel'
import '../../images/aa-logo.png'
import './generate-listview.scss'

const GenerateListView = ({ ...props }) => {

  let regionCount = 0

  const origin = useSelector(state => state.selectedOriginListView)

  const destinations = useSelector(state => state.selectedDestinationsListView)

  const [organizeByCategory, setOrganizeByCategory] = useState({})

  const listviewRendering = useSelector(state => state.listviewRendering)

  const displayMapBG = useSelector(state => state.displayMapBG)

  const downloadingPDF = useSelector(state => state.downloadPDFStatus)

  const exportFileType = useSelector(state => state.exportFileType)

  // const exportResolution = useSelector(state => state.exportResolution)

  const regionsDict = []

  const regionRef = useRef()

  const [listedLegalLines, setListedLegalLines] = useState([])

  useEffect(() => {
    if (!origin) props.history.push('/listview')
    let destinationsObject = {}
    destinations.forEach(d => {
      if (!destinationsObject[d.region]) destinationsObject[d.region] = []
      destinationsObject[d.region].push(d)
    })
    let legal = destinations.concat(origin).map(item => { if (item && item.legal) return item.legal })
    legal = legal.filter((item, i) => i == legal.indexOf(item))
    setListedLegalLines(legal)
    setOrganizeByCategory(destinationsObject)
    // console.log(destinationsObject)
  }, [])

  const processByRegion = region => {
    let count = 0
    let arr = organizeByCategory[region].map((item,i) => {
      count++
      // because html2canvas does not format the city names properly,
      // we have to manually split the text and add space where needed -- between capitalized letters and hyphens
      return (<Fragment key={item.code}>
                <div
                  style={{
                    // wordSpacing: exportResolution > 1 ? '-3rem' : 'auto',
                    // lineHeight: exportResolution > 1 ? '-10rem' : 'auto'
                  }}
                  className='listview-city'>
                  {
                    exportFileType == 'PDF'
                    ?
                    item.city.split(/(?=[A-Z])/)
                             .map((_item,i) => (
                               <Fragment key={_item+'-city-span'}>
                                 <span>
                                   {
                                     _item.indexOf('-')
                                     ?
                                       _item.split(/\s*\-\s*/g)
                                            .map((__item, _i) => (<Fragment key={__item+'-city-name-span'}><span>{__item}</span>{ _i < (_item.split(/\s*\-\s*/g).length-1) ? <span>&nbsp;-&nbsp;</span> : '' }</Fragment>))
                                     : (<Fragment key={__item+'-city-name-span-no-hyphen'}>_item</Fragment>)
                                   }
                                </span>{ i < (item.city.split(/(?=[A-Z])/).length-1) ? <span>&nbsp;</span> : '' }
                               </Fragment>
                             ))
                    : item.city
                  }
                </div>
              </Fragment>)
    })

    let arrays = []

    for (let i = 0, incr = 20; i < arr.length; i+=incr) {
      let _arr = arr.slice(i, i + incr)
      // console.log(_arr.length)
      let _arrLen = _arr.length

      if (i == 0) {
        _arr.unshift((
          <Fragment key={region + count + i}>
            <div
              className='listview-region'>
              {
                region.trim() == 'United States'
                ? 'USA'
                :
                  <>
                  {
                    exportFileType == 'PDF'
                    ? region.split(/(?=[A-Z])/).map((item,i) => (<Fragment key={item+'-region-span'}><span>{item}</span>{ i < (region.split(/(?=[A-Z])/).length-1) ? <span>&nbsp;</span> : '' }</Fragment>))
                    : region
                  }
                  </>
              }
            </div>
          </Fragment>
        ))
        // _arr.push((
        //   <Fragment key={'br' + count + i}>
        //     <br/>
        //     <br/>
        //   </Fragment>
        // ))
      } else {
        _arr.unshift((
          <Fragment key={'spacer' + count + i}>
            <div style={{ padding: '2.25rem 0 0 0' }}></div>
          </Fragment>
        ))
      }

      arrays.push((
        <Fragment key={'col' + count + i}>
          <div
            className='col-med listview-column'
            style={{
              height: '100%',
              position: 'relative',
            }}>
            <div
              style={{
                // top: i > 19 ? '32px' : '8px',
                // height: i > 19 ? 'calc(100% - 64px)' : 'calc(100% - 32px)',
                top: '8px',
                height: 'calc(100% - 72px)',
                position: 'absolute',
                borderLeft: i < 20 ? '1px solid #000' : 'none',
              }}>
              <div
                style={{
                }}>
              </div>
            </div>
            {/*
            <div
              style={{
                position: 'relative'
              }}>
              {
                i == 0
                ?
                  (<div
                    style={{
                      position: 'absolute',
                      transform: _arrLen > 15 ? `scaleY(${_arrLen + 3})` : `scaleY(${_arrLen + 1})`,
                      top: _arrLen > 15 ? `calc(2rem + ${(_arrLen + 3) * .4}rem)` : `calc(2rem + ${_arrLen * .4}rem)`,
                    }}
                    className='listview-divider'>
                    |
                  </div>)
                : null
              }
              </div>*/}
            {_arr}
          </div>
        </Fragment>
      ))

    }

    return arrays

  }

  return (
    <>
    <div className='row'>
      <UserLeftSidePanel/>
      <DownloadImagePanel type='listview' label='List View'/>
      <div
        className='col-med'
        style={{
          height:'100vh',
          backgroundColor: exportFileType == 'PNG' && listviewRendering ? 'rgba(0,0,0,0)' : '#fff',
          // transform: `scale(${exportResolution}, ${exportResolution})`,
          boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
        }}>
        <div
          id='listview-content'
          className={`listview-content pdf-content ${ listviewRendering ? 'listview-content-rendering' : '' }`}
          style={{
            borderLeft: downloadingPDF ? 'none' : '1px solid #ccc'
          }}>
          {/*<div className='listview-logo-container'></div>*/}
          <div className='listview-title-content'>
            {/*<img className='listview-logo' src='./img/aa-logo.png'/>*/}
            <div className='listview-origin-title'>{ origin ? origin.code : '' }</div>
            <div className='listview-origin-title-divider'>
              <div className='listview-origin-title-divider-inner'>
                |
              </div>
            </div>
            <div className='listview-origin-subtitle'>
              <div className='listview-origin-subtitle-inner'>
                &nbsp;&nbsp;Direct&nbsp;flights&nbsp;to&nbsp;and&nbsp;from<br/>
                &nbsp;&nbsp;{
                  origin
                  ?
                    <>
                    {
                      exportFileType == 'PDF'
                      ? origin.city.split(/(?=[A-Z])/).map((item,i) => (<Fragment key={item+'-span'}><span className='listview-origin-region'>{item}</span>{ i < (origin.city.split(/(?=[A-Z])/).length-1) ? <span>&nbsp;</span> : '' }</Fragment>))
                      : origin.city
                    }
                    </>
                  : ''
                }&nbsp;,&nbsp;
                {
                  origin
                  ?
                    <>
                    {
                      exportFileType == 'PDF'
                      ? origin.region.split(/(?=[A-Z])/).map((item,i) => (<Fragment key={item+'-span'}><span className='listview-origin-region'>{item}</span>{ i < (origin.region.split(/(?=[A-Z])/).length-1) ? <span>&nbsp;</span> : '' }</Fragment>))
                      : origin.region
                    }
                    </>
                  : ''
                }
              </div>
            </div>
            <br/>
            <br/>
          </div>
          <div className='listview-main-content'>
            <div className='row'>
              {
                organizeByCategory
                ?
                  Object.keys(organizeByCategory).map(region => {
                    return (<Fragment key={region}>
                      {
                        region.trim() == 'United States' || organizeByCategory[region].length > 20
                        ? (<>
                            {
                              (() => { regionCount++ })()
                            }
                            <div
                              className='row'
                              style={{
                                margin: '0 0 0 2px'
                              }}>
                              {
                                processByRegion(region)
                              }
                            </div>
                          </>)
                        :
                          <>
                            {
                              (() => { regionCount++ })()
                            }
                            {
                              processByRegion(region)
                            }
                          </>
                      }
                    </Fragment>)
                  }) : null
              }
            </div>
            <div style={{ paddingBottom: '20px' }}></div>
            {
              listedLegalLines.map(line => line ? <Fragment key={`legal-line-${line}`}><div className='legal-line'><span>*&nbsp;</span>{line}</div></Fragment> : null)
            }
            <br/><br/>
            <div style={{ paddingBottom: '40px' }}></div>
          </div>
        </div>
      </div>
      </div>
    </>
  )

}

export default withRouter(GenerateListView)
