import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Auth} from 'aws-amplify';

global.fetch = require('node-fetch')
const cc = require('cryptocompare')

export default class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ethPrice: 0
    }
  }

  handleLogout = async event => {
    await Auth.signOut();

    this
      .props
      .userHasAuthenticated(false, '');
  }

  render() {
    // cc
    //   .price('ETH', 'USD')
    //   .then(prices => {
    //     this.setState({ethPrice: prices})
    //   })
    return (
      <div>
        <nav
          className="navbar has-background-info is-transparent"
          role="navigation"
          aria-label="main navigation">
          <div className="navbar-brand">
            {(this.props.isAuthenticated && this.props.currentUser.username === '8cf69f19-9be1-404e-83d8-ed1f064a035f')
              ? <Link className="navbar-item" to="/eval">
                  <span className="icon">
                    <i className="fas fa-lg fa-home has-text-white"></i>
                  </span>
                  <h1 className="nav-title has-text-white">HomeInsure</h1>
                </Link>
              : <Link className="navbar-item" to="/home">
                <span className="icon">
                  <i className="fas fa-lg fa-home has-text-white"></i>
                </span>
                <h1 className="nav-title has-text-white">HomeInsure</h1>
              </Link>
}

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

            {(this.props.isAuthenticated && this.props.currentUser.username !== '8cf69f19-9be1-404e-83d8-ed1f064a035f')
              ? <div className="navbar-end">
                  <Link className="navbar-item has-text-white" to='/request'>
                    Request
                  </Link>
                  <Link className="navbar-item has-text-white" to='/sell'>
                    Invest
                  </Link>
                  <Link className="navbar-item has-text-white" to='/requester-profile'>
                    My Plans
                  </Link>
                  <Link className="navbar-item has-text-white" to='/' onClick={this.handleLogout}>
                    Logout
                  </Link>
                </div>
              : (this.props.isAuthenticated && this.props.currentUser.username === '8cf69f19-9be1-404e-83d8-ed1f064a035f')
                ? <div className="navbar-end">
                    <Link className="navbar-item has-text-white" to='/eval'>
                      Evaluator
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