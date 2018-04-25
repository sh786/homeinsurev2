import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Nav extends Component {

  render() {
    return (
      <div>
        <nav
          className="navbar has-background-info is-transparent"
          role="navigation"
          aria-label="main navigation">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/">
              <span className="icon">
                <i className="fas fa-lg fa-home has-text-white"></i>
              </span>
              <h1 className="nav-title has-text-white">HomeInsure</h1>
            </Link>

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
          <div className="navbar-menu">
            <div className="navbar-end">
              <Link className="navbar-item has-text-white" to='/request'>
                Buyer
              </Link>
              <Link className="navbar-item has-text-white" to='/sell'>
                Seller
              </Link>
              <Link className="navbar-item has-text-white" to='/requester-profile'>
                RequesterProfile
              </Link>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}