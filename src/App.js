import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import CustomNavbar from './components/layout/CustomNavbar'
import SignUp from './components/auth/SignUp'
import SignIn from './components/auth/SignIn'
import Map from './components/map/Map'
import CreateRanking from './components/rank/CreateRanking'
import ShowRanking from './components/rank/ShowRanking'
require('dotenv').config()

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <CustomNavbar />
          <Switch>
            <Route exact path='/' component={Map} />
            <Route path='/signup' component={SignUp} />
            <Route path='/signin' component={SignIn} />
            <Route path='/create' component={CreateRanking} />
            <Route path='/:id' component={ShowRanking} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
