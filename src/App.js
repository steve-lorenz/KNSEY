import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import SignUp from './components/auth/SignUp'
import SignIn from './components/auth/SignIn'
import Map from './components/map/Map'
import Ranking from './components/rank/Ranking'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path='/' component={Map} />
            <Route path='/signup' component={SignUp} />
            <Route path='/signin' component={SignIn} />
            <Route path='/ranking' component={Ranking} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
