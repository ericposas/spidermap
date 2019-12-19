import React, { useEffect } from 'react'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import LoginPanel from './components/Login/LoginPanel'
import SignUp from './components/Login/SignUp'
import Dashboard from './components/Pages/Dashboard'
import Spidermap from './components/Pages/Spidermap'
import Pointmap from './components/Pages/Pointmap'
import ListView from './components/Pages/ListView'
import GenerateSpidermap from './components/Pages/GenerateSpidermap'
import GeneratePointmap from './components/Pages/GeneratePointmap'
import GenerateListView from './components/Pages/GenerateListView'
import Upload from './components/Pages/Upload'
import MyFiles from './components/Pages/MyFiles'
import MyMaps from './components/Pages/MyMaps'
import GlobalMaps from './components/Pages/GlobalMaps'
import GenerateSpidermapTest from './components/Pages/GenerateSpidermapTest'
import { WINDOW_RESIZE, RESIZE_ADDED } from './constants/constants'

const App = ({ ...props }) => {

  const dispatch = useDispatch()

  const windowSize = useSelector(state => state.windowSize)

  const resizeListenerAdded = useSelector(state => state.resizeListenerAdded)

  useEffect(() => {
    if (resizeListenerAdded == false) {
      dispatch({ type: RESIZE_ADDED })
      dispatch({ type: WINDOW_RESIZE, payload: { innerWidth, innerHeight } })
      window.addEventListener('resize', () => {
        dispatch({ type: WINDOW_RESIZE, payload: { innerWidth, innerHeight } })
      })
    }
  }, [])

  return (<>
    <Router>
      <Switch>
        <Route exact path='/'>
          <Redirect to='/login'/>
        </Route>
        <Route path='/login' component={LoginPanel}/>
        <Route path='/dashboard'>
          <Dashboard/>
        </Route>
        <Route path='/my-maps' component={MyMaps}/>
        <Route path='/global-maps' component={GlobalMaps}/>
        <Route path='/generate-listview' component={GenerateListView}/>
        <Route path='/generate-spidermap' component={GenerateSpidermapTest}/>
        <Route path='/generate-pointmap' component={GeneratePointmap}/>
        <Route path='/listview' component={ListView}/>
        <Route path='/pointmap' component={Pointmap}/>
        <Route path='/spidermap' component={Spidermap}/>
        <Route path='/signUp' component={SignUp}/>
        <Route path='/myfiles' component={MyFiles}/>
      </Switch>
    </Router>
  </>)
}

export default App
