import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { Auth } from 'aws-amplify';

export default class Nav extends Component {
  constructor(props) {
    super(props);

  }

  handleLogout = async event => {
    await Auth.signOut();

    this.props.userHasAuthenticated(false, '');
  }

  render() {
    return (
      <div>
        <nav
          className="navbar has-background-info is-transparent"
          role="navigation"
          aria-label="main navigation">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/home">
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
            
              {this.props.isAuthenticated
                ? <div className="navbar-end">
                    <Link className="navbar-item has-text-white" to='/request'>
                      Buyer
                    </Link>
                    <Link className="navbar-item has-text-white" to='/sell'>
                      Seller
                    </Link>
                    <Link className="navbar-item has-text-white" to='/requester-profile'>
                      RequesterProfile
                    </Link>
                    <Link className="navbar-item has-text-white" to='/' onClick={this.handleLogout}>
                      Logout
                    </Link>
                  </div>
                : <div className="navbar-end">
                  <Link className="navbar-item has-text-white" to='/'>
                    Login
                  </Link>
                </div>
              }
              {/* <Link className="navbar-item has-text-white" to='/'>
                Login
              </Link>
              <Link className="navbar-item has-text-white" to='/request'>
                Buyer
              </Link>
              <Link className="navbar-item has-text-white" to='/sell'>
                Seller
              </Link>
              <Link className="navbar-item has-text-white" to='/requester-profile'>
                RequesterProfile
              </Link> */}
          </div>
        </nav>
      </div>
    );
  }
}