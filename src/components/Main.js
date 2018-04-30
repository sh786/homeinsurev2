import React, { Component } from 'react';
// import { render } from 'react-dom';
import { Switch, Route } from 'react-router-dom'

import Home from './Home'
import RequestInsure from './RequestInsure'
import SellInsure from './SellInsure'
import Eval from './Eval'
import RequesterProfile from './RequesterProfile'
import Login from './Login'
import AppliedRoute from "./AppliedRoute";

export default class Main extends Component {
  // constructor(props) {
  //   super(props);

  // }
  // Add any routes that we will use as a Route element below
  // This component handles all routing
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' render={()=><Home storageValue={this.props.storageValue} props={this.props.childProps} />} />
          <Route exact path='/request' component={RequestInsure}/>
          <Route exact path='/sell' component={SellInsure}/>
          <Route exact path='/eval' component={Eval}/>
          <Route exact path='/requester-profile' component={RequesterProfile}/>
          <Route exact path='/login' render={()=><Login props={this.props.childProps} />}/>
        </Switch>
      </main>
    );
  }
}