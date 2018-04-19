import React, { Component } from 'react';
// import { render } from 'react-dom';
import { Switch, Route } from 'react-router-dom'

import Home from './Home'
import RequestInsure from './RequestInsure'
import SellInsure from './SellInsure'

export default class Main extends Component {
  // Add any routes that we will use as a Route element below
  // This component handles all routing
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' render={()=><Home storageValue={this.props.storageValue} />} />
          <Route exact path='/request' component={RequestInsure}/>
          <Route exact path='/sell' component={SellInsure}/>
        </Switch>
      </main>
    );
  }
}