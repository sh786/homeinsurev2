import React, {Component} from 'react'
import {writeHouseData, writeClientData, hash} from '../utils/firebase'
// import {addClient} from '../App'

import InsuranceContract from '../../build/contracts/Insurance.json'
import getWeb3 from '../utils/getWeb3'

export default class RequestInsure extends Component {

  //checks if valid address. NEEDS TO BE ADJUSTED
  isValidData(address, city, state, zip, price) {
    if (address && city && state && zip && price) {
      return true
    } else {
      return false
    }
  }


  // addClient(_house_token) {
  //   //console.log(insurance)
  //   // Declaring this for later so we can chain functions on SimpleStorage.
  //   var insuranceInstance
  //   var my_accounts
  //   // Get accounts.
  //   this
  //     .props
  //     .myweb3
  //     .eth
  //     .getAccounts((error, accounts) => {
  //           this.props.myweb3.eth.defaultAccount = accounts[0]
  //           // Stores a given value, 5 by default.
  //           insuranceInstance = this.props.insuranceInstance
  //           my_accounts = accounts
  //           return insuranceInstance.add_client_address({from: my_accounts[0], gas:100000})
  //         })
  //         .then((result) => {
  //           console.log('adding a house with house_token' + _house_token)
  //           return insuranceInstance.add_house_for_client(_house_token, {from: my_accounts[0]})
  //         })
  //         .then((result) => {
  //             console.log(result)
  //           // Get the value from the contract to prove it worked.
  //           return insuranceInstance
  //             .get_address_to_house_tokens
  //             .call(my_accounts[0])
  //         })
  //         //.then(sleep(1000))
  //         .then((result) => {
  //           console.dir(result)
  //           // console.dir(result[0])
  //           // console.dir(result[0].c)

  //           // console.dir(result[0].c[0])
  //           //console.dir(result.c)
  //           //let house_id = result.c[0]
  //           //console.log(house_id)
  //           // Update state with the result.
  //           //return this.setState({userHouseTokens: result.c[0]})
  //         })
  // }

  addClient(_house_token) {
    //console.log(insurance)
    // Declaring this for later so we can chain functions on SimpleStorage.
    var insuranceInstance

    // Get accounts.
    this
      .props
      .myweb3
      .eth
      .getAccounts((error, accounts) => {
        this.props.insuranceInstance
          .deployed()
          .then((instance) => {
            console.log(instance)
            this.props.myweb3.eth.defaultAccount = accounts[0]
            insuranceInstance = instance

            console.log('adding a house with house_token' + _house_token)
            return insuranceInstance.add_house_for_client(_house_token, {from: accounts[0]})
          })
          .then((result) => {
              console.log(result)
            // Get the value from the contract to prove it worked.
            return insuranceInstance
              .get_address_to_house_tokens
              .call(accounts[0])
          })
          //.then(sleep(1000))
          .then((result) => {
            console.dir(result)
            // console.dir(result[0])
            // console.dir(result[0].c)

            // console.dir(result[0].c[0])
            //console.dir(result.c)
            //let house_id = result.c[0]
            //console.log(house_id)
            // Update state with the result.
            //return this.setState({userHouseTokens: result.c[0]})
          })
      })
  }

  //The yearly stakeholder dividend is a 2-3% markdown  the cut that we take 
  addEvaluation(_house_token, _total_to_insure, _yearly_payment, _yearly_stakeholder_dividend) {

    const contract = require('truffle-contract')
    const insurance = contract(InsuranceContract)
    insurance.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var insuranceInstance

    // Get accounts.
    this
      .state
      .web3
      .eth
      .getAccounts((error, accounts) => {
        insurance
          .deployed()
          .then((instance) => {
            this.state.web3.eth.defaultAccount = accounts[0]
            insuranceInstance = instance

            console.log('Adding evaluator and house pricing info to house token')
            return insuranceInstance.add_evaluation(_house_token,
                _total_to_insure, _yearly_payment, _yearly_stakeholder_dividend, {from: accounts[0]})
          })
          .then((result) => {
            console.log('transaction completed')
            // Get the value from the contract to prove it worked.
            return insuranceInstance
              .get_yearly_stakeholder_dividend
              .call(_house_token)
          })
          //.then(sleep(1000))
          .then((result) => {
            console.dir(result)
            // console.dir(result[0])
            // console.dir(result[0].c)

            // console.dir(result[0].c[0])
            //console.dir(result.c)
            //let house_id = result.c[0]
            //console.log(house_id)
            // Update state with the result.
            //return this.setState({userHouseTokens: result.c[0]})
          })
      })
  }

  // addSecondClient(_house_token) {

  //   const contract = require('truffle-contract')
  //   const insurance = contract(InsuranceContract)
  //   insurance.setProvider(this.props.myweb3.currentProvider)
  //   //console.log(insurance)

  //   // Declaring this for later so we can chain functions on SimpleStorage.
  //   var insuranceInstance

  //   // Get accounts.
  //   this
  //     .props
  //     .myweb3
  //     .eth
  //     .getAccounts((error, accounts) => {
  //       insurance
  //         .deployed()
  //         .then((instance) => {
  //           console.log(instance)
  //           this.props.myweb3.eth.defaultAccount = accounts[0]
  //           insuranceInstance = instance

  //           // Stores a given value, 5 by default.
  //           return insuranceInstance.add_client_address({from: accounts[0], gas:100000})
  //         })
  //         // .then((result) => {
  //         //   console.log('adding house 1')
  //         //   return insuranceInstance.add_house_for_client(101, 10, 1, 1, 1, {from: accounts[0]})
  //         // })
  //         .then((result) => {
  //           console.log('adding a house with house_token' + 101)
  //           return insuranceInstance.add_house_for_client(101, {from: accounts[0]})
  //         })
  //         .then((result) => {
  //           //console.log(result)
  //           // Get the value from the contract to prove it worked.
  //           return insuranceInstance
  //             .get_homeowner
  //             .call(100)
  //         })
  //         //.then(sleep(1000))
  //         .then((result) => {
  //           //console.log(result)

  //           return insuranceInstance
  //             .get_homeowner
  //             .call(101)

  //         })
  //         .then((result) => {
  //             console.log(result)
  //           // Get the value from the contract to prove it worked.
  //           return insuranceInstance
  //             .get_address_to_house_tokens
  //             .call(accounts[0])
  //         })
  //         .then((result) => {
  //           console.log(result)
  //         })

  //     })
  // }

  // addThirdClient(_house_token) {

  //   const contract = require('truffle-contract')
  //   const insurance = contract(InsuranceContract)
  //   insurance.setProvider(this.props.myweb3.currentProvider)

  //   // Declaring this for later so we can chain functions on SimpleStorage.
  //   var insuranceInstance

  //   //console.log(insurance)
  //   // Get accounts.
  //   this
  //     .props
  //     .myweb3
  //     .eth
  //     .getAccounts((error, accounts) => {
  //       insurance
  //         .deployed()
  //         .then((instance) => {
  //           console.log(instance)
  //           this.props.myweb3.eth.defaultAccount = accounts[0]
  //           insuranceInstance = instance

  //           // Stores a given value, 5 by default.
  //           return insuranceInstance.add_client_address({from: accounts[0], gas:100000})
  //         })
  //         // .then((result) => {
  //         //   console.log('adding house 1')
  //         //   return insuranceInstance.add_house_for_client(101, 10, 1, 1, 1, {from: accounts[0]})
  //         // })
  //         .then((result) => {
  //           console.log('adding a house with house_token' + 100)
  //           return insuranceInstance.add_house_for_client(100, {from: accounts[0]})
  //         })
  //         .then((result) => {
  //             console.log(result)
  //           // Get the value from the contract to prove it worked.
  //           return insuranceInstance
  //             .get_homeowner
  //             .call(100)
  //         })
  //         //.then(sleep(1000))
  //         .then((result) => {
  //           //console.log(result)

  //           return insuranceInstance
  //             .get_homeowner
  //             .call(101)

  //         })
  //         .then((result) => {
  //             //console.log(result)
  //           // Get the value from the contract to prove it worked.
  //           return insuranceInstance
  //             .get_address_to_house_tokens
  //             .call(accounts[0])
  //         })
  //         .then((result) => {
  //           console.log(result)
  //         })

  //     })
  // }

  setHouse() {

    console.log(this.props.myweb3)
    let address = this.refs.address.value
    let city = this.refs.city.value
    let state = this.refs.state.value
    let zip = this.refs.zip.value
    let price = this.refs.price.value
    console.log("writing to database")
    //write dummy client data
    //writeClientData("chris", "charalampoudis", "helloworld");
    var concatenated_city_address = city.concat(address)

    let hashed_house_token = hash(concatenated_city_address)
    console.log(this.props.storageValue)
    //this.addClient(hashed_house_token)

    //this.addSecondClient(hashed_house_token)
    //this.addThirdClient(hashed_house_token)
    this.addClient(hashed_house_token)
    //console.log('add client finished')


    if (this.isValidData(address, city, state, zip, price)) {
      writeHouseData(address, city, state, zip, price, this.props.currentUser.username)
      // TODO: Also store user's ethereum address
      // TODO: Generate house token
      // TODO: Add add_house_to_client
    }
  }

  render() {
    return (
      <div>
        <div className="container request-form">
          <h1 className="title">Request Insurance</h1>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input className="input" type="text" placeholder="Name" id="name"/>
            </div>
          </div>

          <div className="field">
            <label className="label">Email</label>
            <div className="control has-icons-left has-icons-right">
              <input className="input" type="email" id="email" placeholder="Email input"/>
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
            </div>
          </div>

          <label className="label">Address</label>
          <div className="field is-grouped">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Street Address"
                ref="address"/>
            </div>
            <div className="control">
              <input className="input" type="text" placeholder="City" ref="city"/>
            </div>
            <div className="control">
              <input className="input" type="text" placeholder="State Abbr." ref="state"/>
            </div>
            <div className="control">
              <input className="input" type="text" placeholder="Zip" ref="zip"/>
            </div>
            <div className="control">
              <input
                className="input"
                type="integer"
                placeholder="Price of Home (ETH)"
                ref="price"/>
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button
                className="button is-link"
                ref="submit"
                onClick={this
                .setHouse
                .bind(this)}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}