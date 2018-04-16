import React, {Component} from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './css/bulma.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance. See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({web3: results.web3})

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    }).catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this
      .state
      .web3
      .eth
      .getAccounts((error, accounts) => {
        simpleStorage
          .deployed()
          .then((instance) => {
            simpleStorageInstance = instance

            // Stores a given value, 5 by default.
            return simpleStorageInstance.set(5, {from: accounts[0]})
          })
          .then((result) => {
            // Get the value from the contract to prove it worked.
            return simpleStorageInstance
              .get
              .call(accounts[0])
          })
          .then((result) => {
            // Update state with the result.
            return this.setState({storageValue: result.c[0]})
          })
      })
  }

  render() {
    return (
      <div className="App">
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

            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
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
              <a href="request.html">
                <div className="box buy-button has-background-info has-text-white">
                  <p>Buyer</p>
                  <p className="sub-button-text">Request an insurance quote.</p>
                </div>
              </a>
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
              <p>The stored value is: {this.state.storageValue}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
