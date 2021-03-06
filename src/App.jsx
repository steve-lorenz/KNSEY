import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CustomNavbar from './components/layout/CustomNavbar';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import Map from './components/map/Map';
import Landing from './components/landing/Landing';
import CreateRanking from './components/rank/CreateRanking';
import ShowRanking from './components/rank/ShowRanking';

require('dotenv').config();

const App = () => (
  <BrowserRouter>
    <div className="App">
      <CustomNavbar />
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/map" component={Map} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />
        <Route path="/create" component={CreateRanking} />
        <Route path="/:id" component={ShowRanking} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
