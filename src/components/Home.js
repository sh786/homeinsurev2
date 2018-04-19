import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Home extends Component {

  render() {
    return (
      <div>
        <div className="container">
          <div className="level main-buttons">
            <div className="level-left has-text-centered">
              <Link to='/request'>
                <div className="box buy-button has-background-info has-text-white">
                  <p>Buyer</p>
                  <p className="sub-button-text">Request an insurance quote.</p>
                </div>
              </Link>
            </div>
            <div className="level-right has-text-centered">
              <Link to='/sell'>
                <div className="box sell-button has-background-info has-text-white">
                  <p>Seller</p>
                  <p className="sub-button-text">Buy shares in an insurance plan.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully, below will show a
                stored value of 5 (by default).</p>
              <p>Try changing the value stored on
                <strong>line 59</strong>
                of App.js.</p>
              <p>The stored value is: {this.props.storageValue}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}