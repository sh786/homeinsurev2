import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { Auth } from 'aws-amplify'

export default class Home extends Component {

  render() {
    return (
      <div>
        <div className="container">
          <div className="level main-buttons">
            <div className="level-left has-text-centered">
              <Link to='/request'>
                <div className="box buy-button has-background-info has-text-white">
                  <p>Request</p>
                  <p className="sub-button-text">Request an insurance quote.</p>
                </div>
              </Link>
            </div>
            <div className="level-right has-text-centered">
              <Link to='/sell'>
                <div className="box sell-button has-background-info has-text-white">
                  <p>Invest</p>
                  <p className="sub-button-text">Buy shares in an insurance plan.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}