import React, { Component } from 'react'
import { HashRouter as Router, BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import LoginPanel from './components/Login/LoginPanel'
import SignUp from './components/Login/SignUp'
import Dashboard from './components/Pages/Dashboard'
import Spidermap from './components/Pages/Spidermap'
import Pointmap from './components/Pages/Pointmap'
import ListView from './components/Pages/ListView'
import GenerateSpidermap from './components/Pages/GenerateSpidermap'
import GeneratePointmap from './components/Pages/GeneratePointmap'
import Upload from './components/Pages/Upload'
import MyFiles from './components/Pages/MyFiles'
// import './images/GettyImages-157529424.png'

const App = ({ ...props }) => (
  <>
    {/*
      <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundImage: 'url(./img/GettyImages-157529424.png)'
      }}></div>
    */}
    <Router>
      <Switch>
        <Route exact path='/'>
          <Redirect to='/login'/>
        </Route>
        <Route path='/login' component={LoginPanel}/>
        <Route path='/dashboard'>
          <Dashboard/>
        </Route>
        <Route path='/generate-spidermap' component={GenerateSpidermap}/>
        <Route path='/generate-pointmap' component={GeneratePointmap}/>
        <Route path='/spidermap' component={Spidermap}/>
        <Route path='/pointmap' component={Pointmap}/>
        <Route path='/listview' component={ListView}/>
        <Route path='/signUp' component={SignUp}/>
        {/* <Route path='/upload' component={Upload}/> */}
        <Route path='/myfiles' component={MyFiles}/>
      </Switch>
    </Router>
  </>
)

export default App
