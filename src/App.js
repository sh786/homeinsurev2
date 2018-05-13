import React, {Component} from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import InsuranceContract from '../build/contracts/Insurance.json'
import getWeb3 from './utils/getWeb3'
import { Auth } from "aws-amplify"
import { withAuthenticator } from 'aws-amplify-react'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './css/bulma.css'
import './App.css'
import './fonts/fontawesome-all.js'

import Main from './components/Main'
import Nav from './components/Nav'

import {init as firebaseInit} from './utils/firebase'


class App extends Component {
  constructor(props) {
    super(props)
    firebaseInit()

    this.state = {
      storageValue: 10,
      userHouseTokens: [],
      web3: null,
      isAuthenticated: false,
      isAuthenticating: true,
      currentUser: '',
      insuranceInstance: null,
    }
  }

  userHasAuthenticated = (authenticated, user) => {
    this.setState({ isAuthenticated: authenticated, currentUser: user });
  }

  componentWillMount() {
    // Get network provider and web3 instance. See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({web3: results.web3})

      this.addInsuranceContract()
      //this.addClient(100)
      console.log('beast')
      // Instantiate contract once web3 provided.
<<<<<<< HEAD
      // this.instantiateContract()
      this.addClient(53)
      // this.addEvaluation(53, 20, 4, 3)
=======
>>>>>>> a225844a4b22f46ef34e60e13cde914a4d15582a
    }).catch(() => {
      console.log('Error finding web3.')
    })
  }

  async componentDidMount() {
    try {
      if (await Auth.currentSession()) {
        this.userHasAuthenticated(true, await Auth.currentAuthenticatedUser());
      }
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
  
    this.setState({ isAuthenticating: false });

  }

  addInsuranceContract() {
    const contract = require('truffle-contract')
    const insurance = contract(InsuranceContract)
    insurance.setProvider(this.state.web3.currentProvider)  
    this.setState({insuranceInstance: insurance})
    console.log('adding insurance instance')
  }


  // add_house_for_client(uint _house_token, uint _total_to_insure, uint _minimum_stake_payment, uint _yearly_payment, 
  //   uint _yearly_stakeholder_dividend)

  // addInsuranceContract() {
  //   const contract = require('truffle-contract')
  //   const insurance = contract(InsuranceContract)
  //   insurance.setProvider(this.state.web3.currentProvider)  
  //   //this.state.insuranceContract = instanceinsurance.deployed()

  //   var abi_json = require('../build/contracts/Insurance.json')
  //   var abi = abi_json["abi"]

  //   var my_insurance_contract = this.state.web3.eth.contract(abi);
  //   var my_insurance_instance = my_insurance_contract.at(0x9efec315e368e8812025b85b399a69513cd0e716)
    
  //   //var beast_mode = insurance.deployed()
  //   //console.log(my_insurance_instance)
  //   //var myContractInstance = insurance.at(0x9efec315e368e8812025b85b399a69513cd0e716);
  //   //console.log(myContractInstance)
  //   this.setState({insuranceInstance: my_insurance_instance})
  //   // console.log(insurance.deployed())
  //   console.log('adding insurance instance')
  // }




  // addClient(_house_token) {

  //   // Declaring this for later so we can chain functions on SimpleStorage.
  //         this.addInsuranceContract()
  //         var insuranceInstance = this.state.insuranceContract()

  //           // Stores a given value, 5 by default.
  //         //insuranceInstance.add_client_address({from: accounts[0], gas:100000})
          
  //         insuranceInstance.add_client_address({gas:100000})
  //         // .then((result) => {
  //         //   console.log('adding house 1')
  //         //   return insuranceInstance.add_house_for_client(101, 10, 1, 1, 1, {from: accounts[0]})
  //         // })
  //         .then((result) => {
  //           console.log('adding house 2')
  //           return insuranceInstance.add_house_for_client(_house_token, {})
  //         })
  //         .then((result) => {
  //           if (result === true) {
  //             console.log('transaction completed')
  //           }
  //           else {
  //             console.log('transaction 2 didnt work')
  //           }
  //           // Get the value from the contract to prove it worked.
  //           return insuranceInstance
  //             .get_address_to_house_tokens
  //             .call()
  //         })
  //         //.then(sleep(1000))
  //         .then((result) => {
  //           console.dir(result)
  //         })
  //         .then((result) => {

  //           console.log('Adding evaluator and house pricing info to house token')
  //           return insuranceInstance.add_evaluation(_house_token,
  //               _total_to_insure, _yearly_payment, _yearly_stakeholder_dividend, {from: accounts[0], gas:10000000})

  //         })
  //         .then((result) => {
  //           console.log('transaction completed')
  //           // Get the value from the contract to prove it worked.
  //           return insuranceInstance
  //             .get_yearly_stakeholder_dividend
  //             .call(_house_token)
  //         })
      
  // }

  addClient(_house_token) {

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

            // Stores a given value, 5 by default.
            return insuranceInstance.add_client_address({from: accounts[0], gas:100000})
          })
          // .then((result) => {
          //   console.log('adding house 1')
          //   return insuranceInstance.add_house_for_client(101, 10, 1, 1, 1, {from: accounts[0]})
          // })
          .then((result) => {
            console.log('adding house 2')
            return insuranceInstance.add_house_for_client(_house_token, {from: accounts[0]})
          })
          .then((result) => {
            if (result === true) {
              console.log('transaction completed')
            }
            else {
              console.log('fuck you')
            }
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


  createInsuranceInstance() {
    const contract = require('truffle-contract')
    const insurance = contract(InsuranceContract)
    insurance.setProvider(this.state.web3.currentProvider)
    var abi_json = require('../build/contracts/Insurance.json')

    var abi = abi_json["abi"]


    this.setState({insuranceInstance: insurance})

  }


  addClient(_house_token) {

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

            // Stores a given value, 5 by default.
            return insuranceInstance.add_client_address({from: accounts[0], gas:100000})
          })
          // .then((result) => {
          //   console.log('adding house 1')
          //   return insuranceInstance.add_house_for_client(101, 10, 1, 1, 1, {from: accounts[0]})
          // })
          .then((result) => {
            console.log('adding house 2')
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
                _total_to_insure, _yearly_payment, _yearly_stakeholder_dividend, {from: accounts[0], gas:10000000})
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

  // // add_evaluation(uint _house_token,  uint _total_to_insure, uint _yearly_payment, 
  // //  uint _yearly_stakeholder_dividend)

  // //The yearly stakeholder dividend is a 2-3% markdown  the cut that we take 
  // addEvaluation(_house_token, _total_to_insure, _yearly_payment, _yearly_stakeholder_dividend) {

  //   const contract = require('truffle-contract')
  //   const insurance = contract(InsuranceContract)
  //   insurance.setProvider(this.state.web3.currentProvider)

  //   // Declaring this for later so we can chain functions on SimpleStorage.
  //   var insuranceInstance

  //   // Get accounts.
  //   this
  //     .state
  //     .web3
  //     .eth
  //     .getAccounts((error, accounts) => {
  //       insurance
  //         .deployed()
  //         .then((instance) => {
  //           this.state.web3.eth.defaultAccount = accounts[0]
  //           insuranceInstance = instance

  //           console.log('Adding evaluator and house pricing info to house token')
  //           return insuranceInstance.add_evaluation(_house_token,
  //               _total_to_insure, _yearly_payment, _yearly_stakeholder_dividend, {from: accounts[0], gas:10000000})
  //         })
  //         .then((result) => {
  //           console.log('transaction completed')
  //           // Get the value from the contract to prove it worked.
  //           return insuranceInstance
  //             .get_yearly_stakeholder_dividend
  //             .call(_house_token)
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
  //     })
  // }

  // instantiateContract() {
  //   /*
  //    * SMART CONTRACT EXAMPLE
  //          * Normally these functions would be called in the context of a
  //    * state management library, but for convenience I've placed them here.
  //    */

  //   const contract = require('truffle-contract')
  //   const simpleStorage = contract(SimpleStorageContract)
  //   simpleStorage.setProvider(this.state.web3.currentProvider)

  //   // Declaring this for later so we can chain functions on SimpleStorage.
  //   var simpleStorageInstance

  //   // Get accounts.
  //   this
  //     .state
  //     .web3
  //     .eth
  //     .getAccounts((error, accounts) => {
  //       simpleStorage
  //         .deployed()
  //         .then((instance) => {
  //           simpleStorageInstance = instance

  //           // Stores a given value, 5 by default.
  //           return simpleStorageInstance.set(5, {from: accounts[0]})
  //         })
  //         .then((result) => {
  //           // Get the value from the contract to prove it worked.
  //           console.log('got here')
  //           return simpleStorageInstance
  //             .get
  //             .call()
  //         })
  //         .then((result) => {
  //           // Update state with the result.
  //           console.log(result)
  //           console.log(result.c)
  //           console.log('val ' + result.c[0])
  //           console.log('storage value ' + this.state.storageValue)
  //           return this.setState({storageValue: result.c[0]})
  //         })
  //         console.log('finished setting new val')
  //     })
  // }




  render() {
    console.log(this.state.currentUser)
    let childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    }
    return (
      !this.state.isAuthenticating &&
      <div className="App">
        <Nav isAuthenticated={this.state.isAuthenticated} userHasAuthenticated={this.userHasAuthenticated} currentUser={this.state.currentUser} />
        <Main insuranceInstance={this.state.insuranceInstance} myweb3={this.state.web3} currentUser={this.state.currentUser} storageValue={this.state.storageValue} childProps={childProps} />
      </div>
    );
  }
}

// export default withAuthenticator(App)
export default App
