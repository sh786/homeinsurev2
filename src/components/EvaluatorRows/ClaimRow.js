import React, {Component} from 'react'
import {removeHouse, hash} from '../../utils/firebase'
import firebase from 'firebase'

export default class ClaimRow extends Component {

  constructor(props) {
    super(props)
    this.state = {
      //parent: props.parent,
      insurancePlans: props.plans,
      ids: props.ids,
      inputValue: "",
      row: props.row,
      i: props.i,
      insuranceInstance: props.insuranceInstance,
      myweb3: props.myweb3,
    }
  }

  evaluateInsuranceClaim(_house_token, _claim_amount) {

    // Declaring this for later so we can chain functions on SimpleStorage.
    var insuranceInstance
    console.log(this.state.myweb3)
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
            return insuranceInstance.get_homeowner(_house_token, {from: accounts[0]})
          })
          .then((result) => {
            this.updateUI()
          })
            /*
            console.log('Adding stake')
            return insuranceInstance.create_insurance_claim.call(
                _house_token, _claim_amount, {from: accounts[0]})
          })
          .then((result) => {
            console.log('transaction completed')
            //if declined, true
            return insuranceInstance.create_insurance_claim(
                _house_token, _claim_amount, {from: accounts[0]})
          })
          */

      })
  }

  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    })
  }

  updateUI() {
    var updates = {}
    var id = this.state.ids[this.state.i]

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
      status: 6
    }
    updates['/houses/' + id] = updateData
    var tempPlan = this.state.row
    tempPlan = updateData
    this.setState({row: tempPlan})
    return firebase.database().ref().update(updates)
  }

  updateHouse(index, inputValue) {

    var id = this.state.ids[index]
    console.log(this.state.myweb3)
    console.log(index)
    console.log(inputValue)
    var inputValue_as_bignumber = this.state.myweb3.toBigNumber(inputValue)



    var house_token = hash(id)
    console.log('house token ' + house_token)
    var inputValue_as_wei = this.state.myweb3.toWei(inputValue_as_bignumber, 'ether')

    this.evaluateInsuranceClaim(house_token, inputValue_as_wei)

  }

  render() {
    return (
      <tr>
        <td key='address'>{this.state.row.address}</td>
        <td key='city'>{this.state.row.city}</td>
        <td key='state'>{this.state.row.state}</td>
        <td key='zip'>{this.state.row.zip}</td>
        <td key='price'>{this.state.row.price}</td>
        <td>
          <div className="field">
            <div className="control">
              <input className="input" id={"payment" + this.state.i} type="text" 
              placeholder="payment" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)}/>
            </div>
          </div>
        </td>
        <td>
          <div className="field">
            <div className="control">
              <button className="button is-link" id="confirm" onClick={() => this.updateHouse(this.state.i, this.state.inputValue)}>
                <span className="icon">
                  <i className="fas fa-paper-plane has-text-white"></i>
                </span>
              </button>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}