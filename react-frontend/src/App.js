import React, { Component } from 'react'
import { HashRouter as Router, BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import LoginPage from './components/Login/LoginPage'
import SignUp from './components/Login/SignUp'
import Dashboard from './components/Pages/Dashboard'
import Spidermap from './components/Pages/Spidermap'
import Pointmap from './components/Pages/Pointmap'
import ListView from './components/Pages/ListView'

const App = ({ ...props }) => (
  <>
    <Router>
      <Switch>
        <Route exact path='/'>
          <Redirect to='/login'/>
        </Route>
        <Route path='/login' component={LoginPage}/>
        <Route path='/dashboard'>
          <Dashboard/>
        </Route>
        <Route path='/spidermap' component={Spidermap}/>
        <Route path='/pointmap' component={Pointmap}/>
        <Route path='/listview' component={ListView}/>
        <Route path='/signUp' component={SignUp}/>
      </Switch>
    </Router>
  </>
)

export default App
