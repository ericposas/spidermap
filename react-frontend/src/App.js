import React, { Component } from 'react'
import { HashRouter as Router, BrowserRouter, Route, Switch } from 'react-router-dom'
import SpecificGame from './components/SpecificGame'
import Games from './components/Games'

const App = ({ content }) => (
  <>
    <Router>
      <Switch>
        <Route exact path='/' render={() => (<div>{content}</div>)}/>
        <Route path='/games' component={Games}/>
        <Route path='/test' render={() => (<div>Test Route.</div>)}/>
      </Switch>
    </Router>
  </>
)

export default App
