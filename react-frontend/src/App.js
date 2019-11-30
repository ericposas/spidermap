import React, { useEffect } from 'react'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
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
import ListViewPDF from './components/Pages/ListViewPDF'

const App = ({ ...props }) => {

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
        <Route path='/generate-listview' component={GenerateListView}/>
        <Route path='/generate-spidermap' component={GenerateSpidermap}/>
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
