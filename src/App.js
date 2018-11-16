import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import SignUp from './components/auth/SignUp'
import SignIn from './components/auth/SignIn'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route path='/signup' component={SignUp} />
            <Route path='/signin' component={SignIn} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
