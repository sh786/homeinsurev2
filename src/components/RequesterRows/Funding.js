import React, {Component} from 'react'
import {removeHouse, hash} from '../../utils/firebase'
import firebase from 'firebase'

export default class TableRowFunding extends Component {

  constructor(props) {
    super(props)

    this.state = {
      row: props.row,
      i: props.i,
      id: props.id,
      myweb3: props.myweb3,
      insuranceInstance: props.insuranceInstance,
    }
  }

  updateHouse() {
    var updates = {}
    var id = this.state.id

    var homeowner_id = this.state.row["homeowner_id"]
    var quote = this.state.row["quote"]
    var amount = this.state.row["amountRemaining"]
    var address  = this.state.row["address"]
    var city = this.state.row["city"]
    var price = this.state.row["price"]
    var state = this.state.row["state"]
    var zip = this.state.row["zip"]
    //var daysRem = this.state.row["daysRemaining"]
    var daysRem = 0
    var updateData = {
      homeowner_id: homeowner_id,
      address: address,
      city: city,
      price: price,
      quote: quote,
      state: state,
      zip: zip,
      daysRemaining: daysRem,
      amountRemaining: amount,
      status: 4
    }
    updates['/houses/' + id] = updateData
    console.log(updates)
    var tempPlan = this.state.row
    tempPlan = updateData
    this.setState({row: tempPlan})
    return firebase.database().ref().update(updates)
  }


  makeInitialPayment(_house_token, quote_as_bignumber) {

    // Declaring this for later so we can chain functions on SimpleStorage.
    var insuranceInstance

    // Get accounts.
    this
      .state
      .myweb3
      .eth
      .getAccounts((error, accounts) => {
        this.state.insuranceInstance
          .deployed()
          .then((instance) => {
            this.state.myweb3.eth.defaultAccount = accounts[0]
            insuranceInstance = instance

            console.log('Adding stake')
            return insuranceInstance.make_initial_payment(
                _house_token, {from: accounts[0], value: quote_as_bignumber})
          })
          .then((result) => {
            console.log('transaction completed')
            // Get the value from the contract to prove it worked.
            return insuranceInstance
              .get_payment_for_year_completed
              .call(_house_token)
          })
          //.then(sleep(1000))
          .then((result) => {
            console.log('amount paid')
            console.log(result)

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


  checkHouseExpiredOrDeclined(_house_token) {

    // Declaring this for later so we can chain functions on SimpleStorage.
    var insuranceInstance

    // Get accounts.
    this
      .state
      .myweb3
      .eth
      .getAccounts((error, accounts) => {
        this.state.insuranceInstance
          .deployed()

          .then((instance) => {
            this.state.myweb3.eth.defaultAccount = accounts[0]
            insuranceInstance = instance

            console.log('Adding stake')
            return insuranceInstance.check_house_expired_or_declined.call(
                _house_token, true, {from: accounts[0]})
          })
          .then((result) => {
            console.log('transaction completed')
            //if declined, true
            console.log(result)
            return insuranceInstance.check_house_expired_or_declined(
                _house_token, true, {from: accounts[0], gas:100000})
          })

      })
  }

  //function for when a homeowner accepts the insurance quote. Will use the contract
  acceptQuote(){

    var quote = this.state.row["quote"]
    var id = this.state.id
    var quote_as_int = parseInt(quote)
    var quote_as_bignumber = this.state.myweb3.toBigNumber(quote_as_int)

    var house_token = hash(id)
    var quote_as_wei = this.state.myweb3.toWei(quote_as_bignumber, 'ether')

    this.makeInitialPayment(house_token, quote_as_wei)


    //TODO: Client should pay in this function
    //status needs to get changed and money needs to go into the contract
    this.updateHouse()
  }

  declineQuote() {
    var id = this.state.id
    var house_token = hash(id)

    this.checkHouseExpiredOrDeclined(house_token)
    removeHouse(this.state.id);
  }

  render() {
    return (
      <tr>
        <td key={this.state.row.address}>{this.state.row.address}</td>
        <td key={this.state.row.city}>{this.state.row.city}</td>
        <td key={this.state.row.state}>{this.state.row.state}</td>
        <td key={this.state.row.zip}>{this.state.row.zip}</td>
        <td key={this.state.row.price}>{this.state.row.price}</td>
        <td key={this.state.row.quote}>{this.state.row.quote}</td>
        <td key='remaining'>{this.state.row.amountRemaining}</td>
        <td>
          <div className="field">
            <div className="control">
              <button className="button is-small has-background-success" id="confirm" disabled={!(this.state.row.amountRemaining === 0)} onClick={() => this.acceptQuote()}>
                <span className="icon">
                  <i className="fas fa-lg fa-check has-text-white"></i>
                </span>
              </button>
            </div>
          </div>
        </td>
        <td>
          <div className="field">
            <div className="control">
              <button className="button is-small has-background-danger" id="confirm" disabled={!(this.state.row.amountRemaining === 0)} onClick={() => this.declineQuote()}>
                <span className="icon">
                  <i className="fas fa-lg fa-times has-text-white"></i>
                </span>
              </button>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}