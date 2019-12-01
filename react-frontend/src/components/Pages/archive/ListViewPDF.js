import React, { useRef, useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import '../../images/aa-logo.png'
import './generate-listview.scss'
import $ from 'jquery'
import html2pdf from 'html2pdf.js'

const ListViewPDF = ({ ...props }) => {

  const origin = useSelector(state => state.selectedOriginListView)

  const destinations = useSelector(state => state.selectedDestinationsListView)

  const [organizeByCategory, setOrganizeByCategory] = useState({})

  const listviewRendering = useSelector(state => state.listviewRendering)

  const listviewPrinting = useSelector(state => state.listviewPrinting)

  const regionsDict = []

  const regionRef = useRef()

  const listviewContent = useRef()

  const [buttonVis, setButtonVis] = useState('visible')

  useEffect(() => {
    let destinationsObject = {}
    destinations.forEach(d => {
      if (!destinationsObject[d.region]) destinationsObject[d.region] = []
      destinationsObject[d.region].push(d)
    })
    setOrganizeByCategory(destinationsObject)
    $('html').css('width', '100%')
    $('body').css('width', '100%')
    return () => {
      $('html').css('width', '200%')
      $('body').css('width', '200%')
    }
  }, [])

  const processByRegion = region => {
    let count = 0
    let arr = organizeByCategory[region].map((item,i) => {
      count++
      // because html2canvas does not format the city names properly,
      // we have to manually split the text and add space where needed -- between capitalized letters and hyphens
      return (<Fragment key={item.code}>
                <div className='listview-city'>
                  {
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
                  }
                </div>
              </Fragment>)
    })

    let arrays = []

    for (let i = 0, incr = 20; i < arr.length; i+=incr) {
      let _arr = arr.slice(i, i + incr)
      console.log(_arr.length)
      let _arrLen = _arr.length

      if (i == 0) {
        _arr.unshift((
          <Fragment key={region + count + i}>
            <div className='listview-region'>
              {
                region.trim() == 'United States'
                ? 'USA'
                : region.split(/(?=[A-Z])/).map((item,i) => (<Fragment key={item+'-region-span'}><span>{item}</span>{ i < (region.split(/(?=[A-Z])/).length-1) ? <span>&nbsp;</span> : '' }</Fragment>))
              }
            </div>
          </Fragment>
        ))
        _arr.push((
          <Fragment key={'br' + count + i}>
            <br/>
            <br/>
          </Fragment>
        ))
      } else {
        _arr.unshift((
          <Fragment key={'spacer' + count + i}>
            <div style={{ padding: '2.25rem 0 0 0' }}></div>
          </Fragment>
        ))
      }

      arrays.push((
        <Fragment key={'col' + count + i}>
          <div className='col-med listview-column'>
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
                      top: _arrLen > 15 ? `calc(2rem + ${(_arrLen + 3) * .35}rem)` : `calc(2rem + ${_arrLen * .35}rem)`,
                    }}
                    className='listview-divider'>
                    |
                  </div>)
                : null
              }
              </div>
          {_arr}
          </div>
        </Fragment>
      ))

    }

    return arrays

  }

  return (
    <>
    <button
      style={{
        visibility: buttonVis,
        height:'60px',
        width: '120px',
        padding: '0 20px 0 20px',
        margin: '0 0 10px 0',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: 'red',
        color: '#fff',
        position: 'absolute',
        zIndex: 200,
      }}
      onClick={
        () => {
          setButtonVis('hidden')
          setTimeout(() => {
            // window.print()
            // html2pdf(document.body)
            var element = document.getElementById('listview-content');
            var opt = {
              margin:       1,
              filename:     'myfile.pdf',
              image:        { type: 'jpeg', quality: 0.98 },
              html2canvas:  { scale: 2 },
              jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            // New Promise-based usage:
            html2pdf().set(opt).from(element).save();
          }, 1000)
        }
      }>
      Print PDF
    </button>
    <div className='row'>
      <div
        style={{
          height:'100vh',
          backgroundColor: '#fff',
          boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
        }}>
        <div
          ref={listviewContent}
          id='listview-content'
          style={{
            width: '100%',
          }}
          className='listview-content'>
          <div className='listview-logo-container'>
            <img
              className='listview-logo'
              src='./img/aa-logo.png'/>
          </div>
          <div className='listview-title-content'>
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
                  ? origin.city.split(/(?=[A-Z])/).map((item,i) => (<Fragment key={item+'-span'}><span>{item}</span>{ i < (origin.city.split(/(?=[A-Z])/).length-1) ? <span>&nbsp;</span> : '' }</Fragment>))
                  : ''
                }&nbsp;,&nbsp;
                {
                  origin
                  ? origin.region.split(/(?=[A-Z])/).map((item,i) => (<Fragment key={item+'-span'}><span>{item}</span>{ i < (origin.region.split(/(?=[A-Z])/).length-1) ? <span>&nbsp;</span> : '' }</Fragment>))
                  : ''
                }
              </div>
            </div>
            <br/>
            <br/>
          </div>
          <div
            className='listview-main-content'
            style={{
              width: '90%',
            }}>
            <div className='row'>
              {
                organizeByCategory
                ?
                Object.keys(organizeByCategory).map(region => {
                  return (<Fragment key={region}>
                    {
                      region.trim() == 'United States' || organizeByCategory[region].length > 20
                      ? <div
                        className='row'
                        style={{
                          margin: '0 0 0 2px'
                        }}>{
                          processByRegion(region)
                        }
                      </div>
                      : processByRegion(region)
                    }
                  </Fragment>)
                })
                : null
              }
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )

}

export default withRouter(ListViewPDF)
