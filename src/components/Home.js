import React, {Component} from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {

  render() {
    return (
      <div>
        <nav
          className="navbar has-background-info"
          role="navigation"
          aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="./index.html">
              <span className="icon">
                <i className="fas fa-lg fa-home has-text-white"></i>
              </span>
              <h1 className="nav-title has-text-white">HomeInsure</h1>
            </a>

            <a
              role="button"
              className="navbar-burger"
              aria-label="menu"
              aria-expanded="false">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <div className="navbar-menu"></div>
        </nav>

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
              <a href="#">
                <div className="box sell-button has-background-info has-text-white">
                  <p>Seller</p>
                  <p className="sub-button-text">Buy shares in an insurance plan.</p>
                </div>
              </a>
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