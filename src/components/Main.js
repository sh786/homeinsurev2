import React, { Component } from 'react';
// import { render } from 'react-dom';
import { Switch, Route } from 'react-router-dom'

import Home from './Home'
import RequestInsure from './RequestInsure'
import SellInsure from './SellInsure'
import Eval from './Eval'
import RequesterProfile from './RequesterProfile'
import Login from './Login'

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
          <Route exact path='/home' render={()=><Home currentUser={this.props.currentUser} storageValue={this.props.storageValue} auth={this.props.childProps} />} />
          <Route exact path='/request' render={()=><RequestInsure insuranceInstance={this.props.insuranceInstance} myweb3={this.props.myweb3} currentUser={this.props.currentUser} storageValue={this.props.storageValue}/>}/>
          <Route exact path='/sell' render={()=><SellInsure currentUser={this.props.currentUser} myweb3={this.props.myweb3} insuranceInstance={this.props.insuranceInstance} />}/>
          <Route exact path='/eval' render={()=><Eval currentUser={this.props.currentUser} insuranceInstance={this.props.insuranceInstance} myweb3={this.props.myweb3} />}/>
          <Route exact path='/requester-profile' render={()=><RequesterProfile insuranceInstance={this.props.insuranceInstance} myweb3={this.props.myweb3} currentUser={this.props.currentUser} />}/>
          <Route exact path='/' render={()=><Login auth={this.props.childProps} />}/>
        </Switch>
      </main>
    );
  }
}